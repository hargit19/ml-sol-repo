from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from flask_mail import Mail, Message
from pymongo import MongoClient
from bson import ObjectId
import logging
import os
import ephem
import math

# added imports
import numpy as np
from sklearn.preprocessing import MinMaxScaler


import warnings

warnings.simplefilter(action="ignore", category=FutureWarning)

from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.callbacks import EarlyStopping
from keras.regularizers import l2
from keras.layers import Dropout
from keras.optimizers import Adam

client_url_1 = os.getenv("CLIENT_URL_1")
client_url_2 = os.getenv("CLIENT_URL_2")
connection_string = os.getenv("MONGO_DB_URI")
connection_string = connection_string.replace(
    "<password>", os.getenv("MONGO_DB_PASSWORD")
)
db_name = os.getenv("MONGO_DB_NAME")

app = Flask(__name__, static_folder="../pvpowerwebapp-main/build", static_url_path="/")
app.logger.setLevel(logging.DEBUG)  # Set the logging level to DEBUG
handler = logging.StreamHandler()  # Log to console
app.logger.addHandler(handler)

# Set up MongoDB
mongo_client = MongoClient(connection_string)
db = mongo_client[db_name]
collection = db["users"]

# Set up email
app.config["MAIL_SERVER"] = "smtpout.secureserver.net"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = os.getenv("EMAIL_ID")
app.config["MAIL_PASSWORD"] = os.getenv("EMAIL_ID_PASSWORD")
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False

mail = Mail(app)

CORS(app, origins="*")  # to allow requests from client
app.config["UPLOAD_FOLDER"] = "uploads"  # Set the upload folder directory
app.config["ALLOWED_EXTENSIONS"] = {"xlsx", "csv"}  # Set the allowed file extensions

# Define the time array
time_array = []
start_time = 6  # 6 AM
end_time = 19  # 7 PM
for i in range(start_time, end_time + 1):
    if i == end_time:
        time_array.append(str(i) + ":" + "00")
    else:
        for j in range(0, 60, 15):
            if i < 10:
                if j == 0:
                    time_array.append("0" + str(i) + ":" + "0" + str(j))
                else:
                    time_array.append("0" + str(i) + ":" + str(j))
            else:
                if j == 0:
                    time_array.append(str(i) + ":" + "0" + str(j))
                else:
                    time_array.append(str(i) + ":" + str(j))


# Function to send mail
def send_mail(mailId, msgBody):
    msg = Message("Hey", sender="dependencies.mlsol@gmail.com" , recipients=[mailId])
    msg.body = msgBody
    mail.send(msg)
    return "Mail sent"

def saveToCSV(data, userId, lat, long):
    df = pd.DataFrame(data)
    csv_file_path = f"./public/{userId}_{lat}_{long}_data.csv"
    df.to_csv(csv_file_path, index=False)


@app.route("/")
def index():
    return "Hello world!"


@app.route("/api/flask/quick/processing", methods=["POST"])
def process_file():
    nextdate = request.args.get("nextdate")
    userId = request.args.get("_id")
    # Extract latitude and longitude from request parameters
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    data_id = request.args.get("dataId")

    # app.logger.debug("Recieved")
    try:
        # try:
        # Read the JSON data from the file
        file_data = request.get_json()

        df = pd.DataFrame(file_data)
        # print(df["date"])

        x_input = df.shape[1]

        # What is the data here?
        # adding date as index and removing the column
        # Convert 'date' column to datetime format
        df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d %H:%M:%S")
        # Set 'date' column as index
        df.index = df["date"]
        df = df.drop("date", axis=1)

        ###Processing Steps From Here-----------------------------------Additional code
        df_smooth = df.ewm(span=3, adjust=False).mean()
        # Resample to 15-minute intervals using the mean value
        df_resampled = df_smooth.resample("15T").mean()
        df_resampled["date"] = df_resampled.index
        df_resampled["time"] = df_resampled["date"].dt.time
        # slice time from 6 am to 7 pm
        from datetime import time

        cc1 = time.fromisoformat("05:55:00")
        cc2 = time.fromisoformat("19:05:00")
        df = df_resampled[(df_resampled["time"] > cc1) & (df_resampled["time"] < cc2)]
        df = df.reset_index(drop=True)

        # add zenith anglevariable to the dataframe
        observer = ephem.Observer()
        latitude = lat
        longitude = lon
        observer.lat = latitude  # Replace with your latitude from website
        observer.lon = longitude  # session.get('longitude')   Replace with your longitude from website
        zenith_angles = []
        for time in df["date"]:
            observer.date = time
            sun = ephem.Sun()
            sun.compute(observer)
            zenith_angle_rad = sun.alt
            zenith_angle_deg = math.degrees(zenith_angle_rad)
            zenith_angles.append(zenith_angle_deg)
        # Add the solar zenith angle as a new column in the DataFrame
        df["zenith_angle"] = zenith_angles
        df.index = df["date"]
        df.drop(["date", "time"], axis=1, inplace=True)
        df = df.dropna()
        df.drop_duplicates(inplace=True)

        app.logger.debug(df)

        # Data processing steps-
        # Get the start and end date of the original DataFrame
        start_date = df.index.min().date()
        end_date = df.index.max().date()
        # Create a complete date range from 6 am to 7 pm with 15-minute intervals for each day
        complete_date_range = pd.date_range(
            start=start_date, end=end_date + pd.Timedelta(days=1), freq="15T"
        )

        # Create a DataFrame using the complete date range
        df_complete = pd.DataFrame()
        df_complete["date"] = pd.to_datetime(complete_date_range)
        df_complete["time"] = df_complete["date"].dt.time
        df_complete = df_complete[
            (df_complete["time"] > cc1) & (df_complete["time"] < cc2)
        ]
        # Reset the index of the DataFrame
        df_complete.reset_index(drop=True, inplace=True)
        df_complete.index = df_complete.date
        df_complete.drop(df_complete.columns[[0, 1]], axis=1, inplace=True)

        # Merge df and df_complete using merge_asof with outer join
        df_merged = df_complete.combine_first(df)
        # Interpolate missing NaN values with cubic interpolation
        df_filled = df_merged.interpolate(method="cubic", axis=0)
        # Extract the time component from the date-time index
        df_merged["time"] = df_merged.index.time

        # Fill missing NaN values with the average of values at that specific time
        df_filled = df_merged.groupby("time").apply(
            lambda group: group.fillna(group.mean())
        )
        # Round all values to 2 decimal places
        df_filled = df_filled.round(2)
        df_filled.reset_index(level="time", inplace=True)
        # Drop the 'time' column as it's no longer needed
        app.logger.debug(df_filled)

        df_filled.drop("time", axis=1, inplace=True)
        # Sort the index
        df_filled.sort_index(inplace=True)

        # Functions to adjust data into a format known to ML models
        def create_trainable_dataset(dataframe, n_inputs, n_outputs):
            dataframe = pd.DataFrame(dataframe)
            X, Y = list(), list()
            for i in range(len(dataframe) - n_inputs - n_outputs + 1):
                X.append(dataframe.iloc[i : (i + n_inputs), :])
                Y.append(dataframe.iloc[i + n_inputs : i + n_inputs + n_outputs, -2])
            return np.array(X), np.array(Y)

        def split_data(df2, train_ratio, test_ratio):
            # Calculate the number of weeks for training data
            train_weeks = math.floor(len(df2) * train_ratio / 53)

            # Calculate the number of weeks for test data
            test_weeks = math.floor(len(df2) * test_ratio / 53)

            # Calculate the index to split the data for training, validation, and test sets
            train_index = train_weeks * 53
            test_index = train_index + (test_weeks * 53)

            # Split the data into training, validation, and test sets
            train_data = df2.iloc[0:train_index]
            test_data = df2.iloc[train_index:test_index]
            validation_data = df2.iloc[test_index:]
            return train_data, test_data, validation_data

        # Get the trainable varables
        # Split data into training and testing sets
        train_size = 0.8
        test_size = 0.1
        n_input = 53 * 2
        n_output = 53  # 1 day
        train_data, test_data, val_data = split_data(df_filled, train_size, test_size)

        scaler_train = MinMaxScaler()
        train_norm = scaler_train.fit_transform(train_data)
        test_norm = scaler_train.transform(test_data)
        val_norm = scaler_train.transform(val_data)

        # Create trainable datasets
        X_train, Y_train = create_trainable_dataset(train_norm, n_input, n_output)
        X_test, Y_test = create_trainable_dataset(test_norm, n_input, n_output)
        X_val, Y_val = create_trainable_dataset(val_norm, n_input, n_output)

        output_train = train_data.iloc[53:, -2].reset_index(drop=True)
        # Reshape output_train to have two dimensions
        output_train_scaled = np.reshape(output_train.values, (-1, 1))

        # Create and fit_transform the scaler for Y_train
        scaler_Y = MinMaxScaler()
        output_train_scaled = scaler_Y.fit_transform(output_train_scaled)

        ##END of Processinf Steps -----------------------------------------------------

        # Quick Model- LSTM
        # Create a Sequential model- LSTM
        model_unidirectional = Sequential()
        # Add the first LSTM layer with return sequences to pass the sequence to the next layer
        model_unidirectional.add(
            LSTM(
                32,
                input_shape=(X_train.shape[1], X_train.shape[2]),
                return_sequences=True,
                kernel_regularizer=l2(0.01),
            )
        )
        model_unidirectional.add(Dropout(0.2))
        # Flatten the output sequence
        #model_unidirectional.add(LSTM(32))
        #model_unidirectional.add(Dropout(0.2))
        # Add dense layers
       # model_unidirectional.add(Dense(32, activation="relu"))
        # model_unidirectional.add(Dropout(0.2))
        #model_unidirectional.add(Dense(32, activation="relu"))
        # model_unidirectional.add(Dropout(0.2))
        # Add the final dense layer with a linear activation for forecasting 11 values
        model_unidirectional.add(Dense(Y_train.shape[1], activation="linear"))
        custom_optimizer = Adam(learning_rate=0.0001)
        # Compile the model
        model_unidirectional.compile(
            loss="mean_squared_error", optimizer=custom_optimizer
        )
        early_stopping = EarlyStopping(
            monitor="val_loss",
            min_delta=0.001,
            patience=10,
            mode="min",
            baseline=None,
            restore_best_weights=True,
        )
        # Fit the model with early stopping
        history = model_unidirectional.fit(
            X_train,
            np.array(Y_train),
            epochs=10,
            batch_size=256,
            validation_data=(X_test, Y_test),
            callbacks=[early_stopping],
            verbose=1,
        )
        X_last_day = val_norm[-106:]
        X_last_day = X_last_day.reshape(1, 106, x_input)
        Y_next_day_quick = model_unidirectional.predict(X_last_day)
        Y_next_day_quick[Y_next_day_quick < 0] = 0
        # Assuming your scaled variables are in output_test and preds
        Y_next_day_quick = np.reshape(Y_next_day_quick, (-1, 1))
        Y_next_day_quick = scaler_Y.inverse_transform(Y_next_day_quick)
        Y_next_day_quick = Y_next_day_quick.tolist()

        # app.logger.debug(predsRDFOREST)
        sliced_quick = []
        for pred in range(len(Y_next_day_quick)):
            sliced_quick.append(Y_next_day_quick[pred])

        user = collection.find_one({"_id": ObjectId(userId)})
        temp = user.get("PredictedData")[-1]

        for i in range(len(time_array)):
            temp["quick"].append(
                {
                    "date": nextdate,
                    "time": time_array[i],
                    "PredictedPV": sliced_quick[i][0],
                }
            )

        collection.update_one(
            {"_id": ObjectId(userId)},
            {"$set": {"PredictedData.$[elem]": temp}},
            array_filters=[{"elem._id": ObjectId(data_id)}],
        )

        send_mail(user["email"], "Yeah! Your calculation is complete.")
        return jsonify({"message": "Success"}), 200
    except Exception as e:
        user = collection.find_one({"_id": ObjectId(userId)})

        # delete the last element from the list
        temp = user.get("PredictedData")
        temp.pop()

        collection.update_one(
            {"_id": ObjectId(userId)}, {"$set": {"PredictedData": temp}}
        )

        send_mail(user["email"], "Oops! Some error occured during your calculation.")
        app.logger.error(
            "Error occurred during file processing or database interaction: %s", e
        )
        return jsonify(error=str(e)), 404


@app.route("/api/flask/premium/processing", methods=["POST"])
def process_file2():
    nextdate = request.args.get("nextdate")
    userId = request.args.get("_id")
    # Extract latitude and longitude from request parameters
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    data_id = request.args.get("dataId")

    # app.logger.debug("Recieved")
    try:
        # try:
        # Read the JSON data from the file
        file_data = request.get_json()

        df = pd.DataFrame(file_data)
        # print(df["date"])

        x_input = df.shape[1]

        # What is the data here?
        # adding date as index and removing the column
        # Convert 'date' column to datetime format
        df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d %H:%M:%S")
        # Set 'date' column as index
        df.index = df["date"]
        df = df.drop("date", axis=1)

        ###Processing Steps From Here-----------------------------------Additional code
        df_smooth = df.ewm(span=3, adjust=False).mean()
        # Resample to 15-minute intervals using the mean value
        df_resampled = df_smooth.resample("15T").mean()
        df_resampled["date"] = df_resampled.index
        df_resampled["time"] = df_resampled["date"].dt.time
        # slice time from 6 am to 7 pm
        from datetime import time

        cc1 = time.fromisoformat("05:55:00")
        cc2 = time.fromisoformat("19:05:00")
        df = df_resampled[(df_resampled["time"] > cc1) & (df_resampled["time"] < cc2)]
        df = df.reset_index(drop=True)

        # add zenith anglevariable to the dataframe
        observer = ephem.Observer()
        latitude = lat
        longitude = lon
        observer.lat = latitude  # Replace with your latitude from website
        observer.lon = longitude  # session.get('longitude')   Replace with your longitude from website
        zenith_angles = []
        for time in df["date"]:
            observer.date = time
            sun = ephem.Sun()
            sun.compute(observer)
            zenith_angle_rad = sun.alt
            zenith_angle_deg = math.degrees(zenith_angle_rad)
            zenith_angles.append(zenith_angle_deg)
        # Add the solar zenith angle as a new column in the DataFrame
        df["zenith_angle"] = zenith_angles
        df.index = df["date"]
        df.drop(["date", "time"], axis=1, inplace=True)
        df = df.dropna()
        df.drop_duplicates(inplace=True)

        app.logger.debug(df)

        # Data processing steps-
        # Get the start and end date of the original DataFrame
        start_date = df.index.min().date()
        end_date = df.index.max().date()
        # Create a complete date range from 6 am to 7 pm with 15-minute intervals for each day
        complete_date_range = pd.date_range(
            start=start_date, end=end_date + pd.Timedelta(days=1), freq="15T"
        )

        # Create a DataFrame using the complete date range
        df_complete = pd.DataFrame()
        df_complete["date"] = pd.to_datetime(complete_date_range)
        df_complete["time"] = df_complete["date"].dt.time
        df_complete = df_complete[
            (df_complete["time"] > cc1) & (df_complete["time"] < cc2)
        ]
        # Reset the index of the DataFrame
        df_complete.reset_index(drop=True, inplace=True)
        df_complete.index = df_complete.date
        df_complete.drop(df_complete.columns[[0, 1]], axis=1, inplace=True)

        # Merge df and df_complete using merge_asof with outer join
        df_merged = df_complete.combine_first(df)
        # Interpolate missing NaN values with cubic interpolation
        df_filled = df_merged.interpolate(method="cubic", axis=0)
        # Extract the time component from the date-time index
        df_merged["time"] = df_merged.index.time

        # Fill missing NaN values with the average of values at that specific time
        df_filled = df_merged.groupby("time").apply(
            lambda group: group.fillna(group.mean())
        )
        # Round all values to 2 decimal places
        df_filled = df_filled.round(2)
        df_filled.reset_index(level="time", inplace=True)
        # Drop the 'time' column as it's no longer needed
        app.logger.debug(df_filled)

        df_filled.drop("time", axis=1, inplace=True)
        # Sort the index
        df_filled.sort_index(inplace=True)

        # Functions to adjust data into a format known to ML models
        def create_trainable_dataset(dataframe, n_inputs, n_outputs):
            dataframe = pd.DataFrame(dataframe)
            X, Y = list(), list()
            for i in range(len(dataframe) - n_inputs - n_outputs + 1):
                X.append(dataframe.iloc[i : (i + n_inputs), :])
                Y.append(dataframe.iloc[i + n_inputs : i + n_inputs + n_outputs, -2])
            return np.array(X), np.array(Y)

        def split_data(df2, train_ratio, test_ratio):
            # Calculate the number of weeks for training data
            train_weeks = math.floor(len(df2) * train_ratio / 53)

            # Calculate the number of weeks for test data
            test_weeks = math.floor(len(df2) * test_ratio / 53)

            # Calculate the index to split the data for training, validation, and test sets
            train_index = train_weeks * 53
            test_index = train_index + (test_weeks * 53)

            # Split the data into training, validation, and test sets
            train_data = df2.iloc[0:train_index]
            test_data = df2.iloc[train_index:test_index]
            validation_data = df2.iloc[test_index:]
            return train_data, test_data, validation_data

        # Get the trainable varables
        # Split data into training and testing sets
        train_size = 0.8
        test_size = 0.1
        n_input = 53 * 2
        n_output = 53  # 1 day
        train_data, test_data, val_data = split_data(df_filled, train_size, test_size)

        scaler_train = MinMaxScaler()
        train_norm = scaler_train.fit_transform(train_data)
        test_norm = scaler_train.transform(test_data)
        val_norm = scaler_train.transform(val_data)

        # Create trainable datasets
        X_train, Y_train = create_trainable_dataset(train_norm, n_input, n_output)
        X_test, Y_test = create_trainable_dataset(test_norm, n_input, n_output)
        X_val, Y_val = create_trainable_dataset(val_norm, n_input, n_output)

        output_train = train_data.iloc[53:, -2].reset_index(drop=True)
        # Reshape output_train to have two dimensions
        output_train_scaled = np.reshape(output_train.values, (-1, 1))

        # Create and fit_transform the scaler for Y_train
        scaler_Y = MinMaxScaler()
        output_train_scaled = scaler_Y.fit_transform(output_train_scaled)

        ##END of Processing Steps -----------------------------------------------------

        # Quick Model- LSTM
        # Create a Sequential model- LSTM
        model_unidirectional = Sequential()
        # Add the first LSTM layer with return sequences to pass the sequence to the next layer
        model_unidirectional.add(
            LSTM(
                128,
                input_shape=(X_train.shape[1], X_train.shape[2]),
                return_sequences=True,
                kernel_regularizer=l2(0.01),
            )
        )
        model_unidirectional.add(Dropout(0.2))
        # Flatten the output sequence
        model_unidirectional.add(LSTM(64))
        model_unidirectional.add(Dropout(0.2))
        # Add dense layers
        model_unidirectional.add(Dense(32, activation="relu"))
        # model_unidirectional.add(Dropout(0.2))
        model_unidirectional.add(Dense(64, activation="relu"))
        # model_unidirectional.add(Dropout(0.2))
        # Add the final dense layer with a linear activation for forecasting 11 values
        model_unidirectional.add(Dense(Y_train.shape[1], activation="linear"))
        custom_optimizer = Adam(learning_rate=0.0001)
        # Compile the model
        model_unidirectional.compile(
            loss="mean_squared_error", optimizer=custom_optimizer
        )
        early_stopping = EarlyStopping(
            monitor="val_loss",
            min_delta=0.001,
            patience=10,
            mode="min",
            baseline=None,
            restore_best_weights=True,
        )
        # Fit the model with early stopping
        history = model_unidirectional.fit(
            X_train,
            np.array(Y_train),
            epochs=10,
            batch_size=128,
            validation_data=(X_test, Y_test),
            callbacks=[early_stopping],
            verbose=1,
        )
        X_last_day = val_norm[-106:]
        X_last_day = X_last_day.reshape(1, 106, x_input)
        Y_next_day_premium = model_unidirectional.predict(X_last_day)
        Y_next_day_premium[Y_next_day_premium < 0] = 0
        # Assuming your scaled variables are in output_test and preds
        Y_next_day_premium = np.reshape(Y_next_day_premium, (-1, 1))
        Y_next_day_premium = scaler_Y.inverse_transform(Y_next_day_premium)
        Y_next_day_premium = Y_next_day_premium.tolist()

        # app.logger.debug(predsRDFOREST)
        sliced_premium = []
        for pred in range(len(Y_next_day_premium)):
            sliced_premium.append(Y_next_day_premium[pred])

        user = collection.find_one({"_id": ObjectId(userId)})
        temp = user.get("PredictedData")[-1]

        for i in range(len(time_array)):
            temp["premium"].append(
                {
                    "date": nextdate,
                    "time": time_array[i],
                    "PredictedPV": sliced_premium[i][0],
                }
            )

        collection.update_one(
            {"_id": ObjectId(userId)},
            {"$set": {"PredictedData.$[elem]": temp}},
            array_filters=[{"elem._id": ObjectId(data_id)}],
        )

        # save data to csv
        saveToCSV(temp["premium"], userId, lat, lon)

        send_mail(user["email"], "Yeah! Your calculation is complete.")
        return jsonify({"message": "Success"}), 200
    except Exception as e:
        user = collection.find_one({"_id": ObjectId(userId)})

        # delete the last element from the list
        temp = user.get("PredictedData")
        temp.pop()

        collection.update_one(
            {"_id": ObjectId(userId)}, {"$set": {"PredictedData": temp}}
        )
        send_mail(user["email"], "Oops! Some error occured during your calculation.")
        app.logger.error(
            "Error occurred during file processing or database interaction: %s", e
        )
        return jsonify(error=str(e)), 404
