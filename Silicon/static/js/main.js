// Base URL configuration
const BASE_URL = "https://win24-assignment.azurewebsites.net/api";

// Helper function for API requests
async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };

  try {
    const response = await fetch(url, {
      method : method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : null,
    });
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;

  } catch (error) {
    /*console.error(`API request error: ${error.message}`);*/
    throw error; // Re-throw to allow further handling if needed
  }
}

// Specific API functions
async function getTestimonials() {
  return apiRequest("/testimonials");
}

async function getFAQs() {
  return apiRequest("/faq");
}

async function subscribe(emailAddress) {
  return apiRequest("/forms/subscribe", "POST", { email: emailAddress });
}

async function contact(fullname, emailAddress, specialist) {
  return apiRequest("/forms/contact", "POST", {
    fullName: fullname,
    email: emailAddress,
    specialist,
  });
}

document.getElementById("subscribe-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const emailInput = document.getElementById("email");
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");
  
    // Clear previous messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
  
    // Simple frontend validation
    const email = emailInput.value.trim();
    if (!email) {
      errorMessage.textContent = "Email address is required.";
      errorMessage.style.display = "block";
      return;
    }
  
    if (!validateEmail(email)) {
      errorMessage.textContent = "Invalid email format.";
      errorMessage.style.display = "block";
      return;
    }
  
    // Send the API request
    try {
      await subscribe(email);
      successMessage.textContent = "You have subscribed successfully!";
      successMessage.style.display = "block";
    } catch (error) {
      console.log(error);
      errorMessage.textContent = "Failed to subscribe. Please try again later.";
      errorMessage.style.display = "block";
    }
  });

document.getElementById("appointment-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const fullNameInput = document.getElementById("appointment-fullname");
    const emailInput = document.getElementById("appointment-email");
    
    const specialistSelectElement = document.getElementById("appointment-specialists-select");
    const specialist = specialistSelectElement.value;

    const dateSelectElement = document.getElementById("appointment-date-select");
    const date = dateSelectElement.value;

    console.log(`Nothing to be done for selected date ${date} as API does not accept it as a parameter`);

    const timeSelectElement = document.getElementById("appointment-time-select");
    const time = timeSelectElement.value;

    console.log(`Nothing to be done for selected time ${time} as API does not accept it as a parameter`);

    const fullNameErrorMessage = document.getElementById("appointment-fullname-errorMessage");
    const emailErrorMessage = document.getElementById("appointment-email-errorMessage");
    const specialistErrorMessage = document.getElementById("appointment-specialist-errorMessage");
    const dateErrorMessage = document.getElementById("appointment-date-errorMessage");
    const timeErrorMessage = document.getElementById("appointment-time-errorMessage");

    const appointmentSuccessMessage = document.getElementById("appointment-successMessage");
    const appointmentErrorMessage = document.getElementById("appointment-errorMessage");
  
    // Clear previous messages
    fullNameErrorMessage.style.display = "none";
    emailErrorMessage.style.display = "none";
    specialistErrorMessage.style.display = "none";
    dateErrorMessage.style.display = "none";
    timeErrorMessage.style.display = "none";
    
    appointmentSuccessMessage.style.display = "none";
    appointmentErrorMessage.style.display = "none";
  
    // Simple frontend validation
    const email = emailInput.value.trim();
    if (!email) {
      emailErrorMessage.textContent = "Email address is required.";
      emailErrorMessage.style.display = "block";
      return;
    }
    
    const fullName = fullNameInput.value.trim();
    if (!fullName) {
      fullNameErrorMessage.textContent = "Name is required.";
      fullNameErrorMessage.style.display = "block";
      return;
    }

    if (!validateFullName(fullName)) {
      fullNameErrorMessage.textContent = "Invalid name format.";
      fullNameErrorMessage.style.display = "block";
      return;
    }

    if (!validateEmail(email)) {
      emailErrorMessage.textContent = "Invalid email format.";
      emailErrorMessage.style.display = "block";
      return;
    }
  
    // Send the API request
    try {
      await contact(fullName, email, specialist);
      appointmentSuccessMessage.textContent = "Appointment booked successfully!";
      appointmentSuccessMessage.style.display = "block";
      console.log("success");
    } catch (error) {
      console.log(error);
      appointmentErrorMessage.textContent = "Failed to book appointment. Please try again later.";
      appointmentErrorMessage.style.display = "block";
    }
  });
  
// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}  

function validateFullName(name) {
  const fullNameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
  return fullNameRegex.test(name);
}

getFAQs().then((data) => {
  console.log(data);
  data.forEach(faq => {
    $('#faq-card-section').append('<div><h6>'+ faq.title + '</h6><p>' + faq.content + '</p></div>');
  }); 
});

getTestimonials().then((data) => {
  console.log(data);
  data.forEach(testimonial => {
    $('#testimonials-card-section').append('<div><h6>'+ testimonial.author + '</h6><p>' + testimonial.comment + '</p></div>');
  }); 
});