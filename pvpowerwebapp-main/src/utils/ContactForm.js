// ContactForm.js - Helper functions for the Contact form

/**
 * Validates the form input fields
 * @param {Object} formData - The data from the form
 * @returns {Object} - The validation result
 */
export function validateContactForm(formData) {
    const { name, email, subject, query } = formData;
    const errors = {};
  
    // Name validation
    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    // Subject validation
    if (!subject || subject.trim() === '') {
      errors.subject = 'Subject is required';
    } else if (subject.length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
  
    // Query validation
    if (!query || query.trim() === '') {
      errors.query = 'Message is required';
    } else if (query.length > 500) {
      errors.query = 'Message must be less than 500 characters';
    } else if (query.length < 10) {
      errors.query = 'Message must be at least 10 characters';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Formats the form data for submission
   * @param {Object} formData - The data from the form 
   * @returns {Object} - The formatted data
   */
  export function formatContactData(formData) {
    const { name, email, subject, query } = formData;
    
    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      query: query.trim(),
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Animates a form element when there's an error
   * @param {HTMLElement} element - The form element to animate
   */
  export function shakeElement(element) {
    element.classList.add('shake-animation');
    
    setTimeout(() => {
      element.classList.remove('shake-animation');
    }, 500);
  }
  
  /**
   * Add this CSS to your Contact.css file for the shake animation
   * 
   * @keyframes shake {
   *   0%, 100% { transform: translateX(0); }
   *   10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
   *   20%, 40%, 60%, 80% { transform: translateX(5px); }
   * }
   * 
   * .shake-animation {
   *   animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
   * }
   */
  
  /**
   * Tracks when fields are filled out
   * @param {Object} formState - Current state of form fields
   * @returns {number} - Percentage of form completion
   */
  export function calculateFormCompletion(formState) {
    const { name, email, subject, query } = formState;
    const fields = [name, email, subject, query];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    
    return Math.round((filledFields / fields.length) * 100);
  }