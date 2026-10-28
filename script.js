const registrationForm = document.querySelector("#regform");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const genderSelect = document.getElementById("gender");
const dobInput = document.getElementById("dob");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const bioTextarea = document.getElementById("bio");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmError");
const genderError = document.getElementById("genderError");
const dobError = document.getElementById("dobError");
const countryError = document.getElementById("countryError");
const phoneError = document.getElementById("phoneError");
const bioError = document.getElementById("bioError");
const successMessage = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const memberCount = document.getElementById("count");
const darkModeButton = document.getElementById("theme");
const emptyNote = document.getElementById("emptyNote");
const formControls = registrationForm.querySelectorAll("input, select, textarea");
const errorElements = registrationForm.querySelectorAll(".error");

console.log("Registration form elements:", {
  form: registrationForm,
  controls: Array.from(formControls),
  errors: Array.from(errorElements),
  successMessage,
  memberList,
  memberCount,
  darkModeButton
});

const fields = [
  {
    input: nameInput,
    error: nameError,
    validate: () => nameInput.value.trim() ? "" : "Please enter your full name."
  },
  {
    input: emailInput,
    error: emailError,
    validate: () => {
      const email = emailInput.value.trim();
      if (!email) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ""
        : "Please enter a valid email address.";
    }
  },
  {
    input: passwordInput,
    error: passwordError,
    validate: () => {
      if (!passwordInput.value) return "Please enter a password.";
      return passwordInput.value.length >= 8
        ? ""
        : "Password must be at least 8 characters long.";
    }
  },
  {
    input: confirmPasswordInput,
    error: confirmPasswordError,
    validate: () => {
      if (!confirmPasswordInput.value) return "Please confirm your password.";
      return confirmPasswordInput.value === passwordInput.value
        ? ""
        : "Passwords do not match.";
    }
  },
  {
    input: genderSelect,
    error: genderError,
    validate: () => genderSelect.value ? "" : "Please select your gender."
  },
  {
    input: dobInput,
    error: dobError,
    validate: () => {
      if (!dobInput.value) return "Please enter your date of birth.";
      const birthDate = new Date(`${dobInput.value}T00:00:00`);
      return birthDate <= new Date()
        ? ""
        : "Date of birth cannot be in the future.";
    }
  },
  {
    input: countryInput,
    error: countryError,
    validate: () => countryInput.value.trim() ? "" : "Please enter your country."
  },
  {
    input: phoneInput,
    error: phoneError,
    validate: () => {
      const phone = phoneInput.value.trim();
      if (!phone) return "Please enter your phone number.";
      const digits = phone.replace(/\D/g, "");
      return /^[+\d\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15
        ? ""
        : "Please enter a valid phone number.";
    }
  },
  {
    input: bioTextarea,
    error: bioError,
    validate: () => bioTextarea.value.trim() ? "" : "Please tell us a little about yourself."
  }
];

function validateField(field) {
  const message = field.validate();
  field.error.textContent = message;
  field.input.classList.toggle("invalid", Boolean(message));
  field.input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

function updateMemberCount() {
  const count = memberList.querySelectorAll(".member-item").length;
  memberCount.textContent = String(count);
  emptyNote.classList.toggle("hidden", count > 0);
}

function addMember(member) {
  const item = document.createElement("li");
  item.className = "member-item";

  const info = document.createElement("div");
  info.className = "info";

  const name = document.createElement("strong");
  name.textContent = member.name;

  const details = document.createElement("span");
  details.textContent = `${member.email} · ${member.country} · ${member.gender}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", `Remove ${member.name}`);
  removeButton.addEventListener("click", () => {
    item.remove();
    updateMemberCount();
  });

  info.append(name, details);
  item.append(info, removeButton);
  memberList.append(item);
  updateMemberCount();
}

for (const field of fields) {
  field.input.addEventListener("input", () => {
    validateField(field);
    if (field.input === passwordInput && confirmPasswordInput.value) {
      validateField(fields.find((candidate) => candidate.input === confirmPasswordInput));
    }
    successMessage.classList.add("hidden");
  });
  field.input.addEventListener("change", () => validateField(field));
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid = fields.map(validateField).every(Boolean);
  if (!isValid) {
    fields.find((field) => field.input.classList.contains("invalid"))?.input.focus();
    return;
  }

  addMember({
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    gender: genderSelect.options[genderSelect.selectedIndex].text,
    country: countryInput.value.trim()
  });

  successMessage.textContent = `${nameInput.value.trim()} has been registered successfully!`;
  successMessage.classList.remove("hidden");
  registrationForm.reset();
  for (const field of fields) {
    field.error.textContent = "";
    field.input.classList.remove("invalid");
    field.input.removeAttribute("aria-invalid");
  }
});

darkModeButton.setAttribute("aria-pressed", "false");
darkModeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark");
  darkModeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
  darkModeButton.setAttribute("aria-pressed", String(isDarkMode));
});
