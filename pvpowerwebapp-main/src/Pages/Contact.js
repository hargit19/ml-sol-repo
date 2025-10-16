import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendQueryMail } from "../api/userFlow.js";
import "../css/Pages/Contact.css";

function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [words, setWords] = useState(0);

  function handleQuery(e) {
    const inputText = e.target.value;

    setQuery(inputText);
    setWords(inputText.length);
  }

  async function handleSubmitQuery(e) {
    e.preventDefault();

    if (query.length > 500) {
      toast.error("Query should be less than 500 characters.");
      return;
    }

    const result = await sendQueryMail({ name, email, query, subject });

    if (result.status === "success") {
      toast.success("Your query is sent. We will get back to you soon.");
    } else {
      toast.error("An error occurred. Please try again later.");
    }

    setEmail("");
    setName("");
    setSubject("");
    setQuery("");
  }

  return (
    <div className="contact__container">
      <div className="contact__text">
        <h1>Contact Us</h1>
        <p className="contact__subtitle">
          Email, call, or complete the form to learn how we can solve your problem.
        </p>
        
        <div className="contact__info">
          <p className="contact__email">admin@ml-sol.com</p>
          <p className="contact__phone">+91 935783023</p>
        </div>
      </div>
      
      <div className="contact__form-container">
        <div className="contact__form-card">
          <h2>Get in Touch</h2>
          <p>You can reach us anytime</p>
          
          <form onSubmit={handleSubmitQuery}>
            <div className="form__row">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form__row">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form__row">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form__row">
              <textarea
                id="textarea"
                name="textarea"
                placeholder="How can we help?"
                value={query}
                maxLength={500}
                onChange={handleQuery}
                required
              />
              <span className="max-wl">{words}/500</span>
            </div>

            <button type="submit" className="contact-sbmt-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;