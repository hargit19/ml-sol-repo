#!/usr/bin/env python3

import requests
import datetime
import os
import pandas as pd
import OleFileIO_PL

# Define the login URL and credentials
login_url = "https://www.ehydromet.in/model/dologin.php"
username = "username"
password = "password"

# To set the password: export EHYDROMET_PASSWORD="your_password"
#password = os.environ.get('EHYDROMET_PASSWORD')

# Define the URL to download the Excel file
download_url = "https://www.ehydromet.in/exportdatewiseexcel2.php"

# Get today's date and yesterday's date
today = datetime.date.today()
yesterday = today - datetime.timedelta(days=1)

# Create a session
session = requests.Session()

# Perform the login
login_data = {
    'username': username,
    'password': password
}

response = session.post(login_url, data=login_data)

# Check if login was successful
if 'authentication failed' not in response.text.lower():
    print("Login successful!")
    
    # Define the list of modemids
    modemids = ['AWS_PCCD1', 'AWS_PCCD2', 'AWS_PCCD3', 'AWS_PCCD4', 'AWS_PCCD5', 'AWS_PCCD6']
    
    for modemid in modemids:
        # Define parameters required for the download
        params = {
            'modemid': modemid,
            'startdate': today,
            'enddate': today
        }
        
        # Proceed to download the Excel file
        excel_response = session.get(download_url, params=params)
        if excel_response.status_code == 200:
            data_directory = '/home/nasser/forecast/Website/Model-master/data'
            # Create the 'data/' directory if it doesn't exist
            os.makedirs(data_directory, exist_ok=True)
            # Set the file name id_data.csv
            file_name = os.path.join(data_directory, f"{modemid}_data.csv")
            
            # OleFileIO is used to read old type of excel files like the one used in ehydromet
            ole = OleFileIO_PL.OleFileIO(excel_response.content)
            df = pd.read_excel(ole.openstream('Workbook'), engine='xlrd')

            # Use the correct header for the file
            new_header = df.iloc[1]  # The second row contains the new header
            df = df[4:]  # Skip the first 4 rows
            df.columns = new_header

            try:
                # Try to read the file
                existing_df = pd.read_csv(file_name)
                # Append df to the existing DataFrame and save it back to the file
                df.to_csv(file_name, mode='a', header=False, index=False)
            except FileNotFoundError:
                # If the file doesn't exist, create a new file and write the DataFrame to it
                df.to_csv(file_name, index=False)

            print(f"CSV file '{file_name}' downloaded and saved successfully.")
        else:
            print(f"Failed to download Excel file for modemid: {modemid}")
    
else:
    print("Login failed.")

