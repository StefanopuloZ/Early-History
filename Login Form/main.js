
(function () {

    let LS = (() => {
        let init = (itemName) => {
            let current = localStorage.getItem(itemName);
            if (current === null) localStorage.setItem(itemName, "[]");
        };
        let get = (itemName) => JSON.parse(localStorage.getItem(itemName));
        let set = (itemName, element) => {
            localStorage.setItem(itemName, JSON.stringify(element));
        };
        let remove = (itemName) => {
            localStorage.removeItem(itemName);
        }
        return {
            init,
            set,
            get,
            remove: remove
        }
    })();

    let currentUser;

    if (LS.get("users") === null) {
        LS.init("users");
        setUser("users", {
            username: "stefan",
            pass: "1234",
            "Security question": "Your first pet`s name",
            securityQuestionAnswer: "micika",
            "Date of birth": "1985-12-20",
            Gender: "Male",
            Bio: "very cool",
            Interests: ["games", "coding"]
        });
    };

    if (document.title === "Login Page") {
        document.getElementById("submit-btn").addEventListener("click", login);
        document.getElementById("logged-user").style.display = "none";
        document.getElementById("register-form").style.display = "none";
        document.getElementById("register").addEventListener("click", goToRegister);
        document.getElementById("register-form-btn").addEventListener("click", register);
        document.getElementById("forgot-pass").addEventListener("click", passRecovery);
        document.getElementById("forgot-pass").style.display = "none";
    } else if (document.title === "Logged User") {
        if (sessionStorage.getItem("currentUser")) {
            currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            showUserInfo(currentUser, "main", false);
        }
    } else if (document.title === "Profile") {
        if (sessionStorage.getItem("currentUser")) {
            currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            showUserInfo(currentUser, "edit-table", true);
            document.getElementById("edit-table").addEventListener("click", editUserInfo);
            let btn = document.querySelectorAll(".pop-btn");
            for (let i = 0; i < btn.length; i++) {
                btn[i].addEventListener("click", toglePop);
            }
        }
    }

    document.getElementById("log-out").addEventListener("click", logOut);

    function editUserInfo(event) {
        let newValue = "";
        let property = event.target.innerText.match(/[^:]*/)[0];
        if (property === "username") {
            alert("Can not change username.")
            return
        } else if (property === "pass") {
            newValue = prompt("Enter new password.");
            if (!newValue) {
                alert("Password not valid.")
            } else {
                if (newValue === prompt("Confirm password.")) {
                    alert("Password changed successfully!");
                } else {
                    newValue = "";
                    alert("Passwords do not match!")
                };
            }
        } else if (property === "Security question" || property === "Answer") {
            document.getElementById("security-question-edit").classList.remove("pop-hide");
            document.getElementById("security-question-edit").classList.add("pop");
            document.getElementById("submit-edit").addEventListener("click", editQuestion);
        } else if (property === "Gender") {
            document.getElementById("gender-edit").classList.remove("pop-hide");
            document.getElementById("gender-edit").classList.add("pop");
            document.getElementById("submit-edit-gender").addEventListener("click", editGender);
        } else if (property === "Bio") {
            newValue = prompt("Edit bio.");
        } else if (property === "Date of birth") {
            document.getElementById("dob-edit").classList.remove("pop-hide");
            document.getElementById("dob-edit").classList.add("pop");
            document.getElementById("submit-edit-dob").addEventListener("click", editDob);
        } else if (property === "Interests") {
            document.getElementById("interests-edit").classList.remove("pop-hide");
            document.getElementById("interests-edit").classList.add("pop");
            document.getElementById("submit-interests-edit").addEventListener("click", editInterests);
        }
        if (newValue !== "") {
            updateUser("users", "username", currentUser.username, property, newValue);
            currentUser[property] = newValue;
            sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", currentUser.username)));
        };
        showUserInfo(currentUser, "edit-table", true);
    }

    function editInterests(event) {
        event.preventDefault();
        let interests = document.querySelectorAll('input[name="interests"]:checked');
        interests = Array.from(interests).map((element) => element.value);
        if (document.querySelector('input[name="interests-other"]').value !== null) {
            let other = document.querySelector('input[name="interests-other"]').value;
            other = other.split(",");
            other.map(element => interests.push(element));
        }
        currentUser.Interests = interests;
        updateUser("users", "username", currentUser.username, "Interests", currentUser.Interests);
        sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", currentUser.username)));
        showUserInfo(currentUser, "edit-table", true);
        alert("Changes accepted.");
        closeWindow("interests-edit");
    }

    function editDob(event) {
        event.preventDefault();
        currentUser["Date of birth"] = document.getElementById("dob").value;
        updateUser("users", "username", currentUser.username, "Date of birth", currentUser["Date of birth"]);
        sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", currentUser.username)));
        showUserInfo(currentUser, "edit-table", true);
        alert("Changes accepted.");
        closeWindow("dob-edit");
    }

    function editGender(event) {
        event.preventDefault();
        currentUser.Gender = document.querySelector('input[name="gender"]:checked').value;
        updateUser("users", "username", currentUser.username, "Gender", currentUser.Gender);
        sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", currentUser.username)));
        showUserInfo(currentUser, "edit-table", true);
        alert("Changes accepted.");
        closeWindow("gender-edit");
    }

    function editQuestion(event) {
        event.preventDefault();
        let question = document.getElementById("security-question").value;
        let answer = document.getElementById("security-question-answer").value;
        if (!answer) {
            alert("Answer can not be empty!");
            document.getElementById("security-question-answer").focus;
            document.getElementById("security-question-answer").classList.add("red-border");
        } else {
            currentUser["Security question"] = question;
            currentUser.securityQuestionAnswer = answer;
            updateUser("users", "username", currentUser.username, "Security question", question);
            updateUser("users", "username", currentUser.username, "securityQuestionAnswer", answer);
            sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", currentUser.username)));
            showUserInfo(currentUser, "edit-table", true);
            document.getElementById("security-question-answer").classList.remove("red-border");
            alert("Changes accepted.");
            closeWindow("security-question-edit");
        }
    }

    function toglePop(event) {
        document.querySelector("." + event.target.parentElement.className).classList.remove("pop");
        document.querySelector("." + event.target.parentElement.classList.add("pop-hide"));
    }

    function closeWindow(id) {
        document.getElementById(id).classList.remove("pop");
        document.getElementById(id).classList.add("pop-hide");
    }

    function passRecovery(event) {
        event.preventDefault();
        let user = document.getElementById("username").value;
        if (pullUser("users", "username", user) === undefined) {
            alert("Username does not exist.");
            return
        }
        else {
            userInfo = pullUser("users", "username", user);
        }
        if (prompt(userInfo["Security question"]) === userInfo.securityQuestionAnswer) {
            let pass = prompt("Enter new password.")
            if (pass === prompt("Confirm password.")) {
                updateUser("users", "username", user, "pass", pass);
                alert("Password changed successfully!");
            } else alert("Passwords do not match!");
        } else alert("Answer not correct.")
    }

    function updateUser(listName, property, value, changeProperty, changeValue) {
        let users = LS.get(listName);
        for (let i = 0; i < users.length; i++) {
            if (users[i][property] === value) {
                users[i][changeProperty] = changeValue;
                LS.set(listName, users);
                return
            }
        }
    }

    function logOut(event) {
        event.preventDefault();
        sessionStorage.removeItem("currentUser");
        alert("Logged out.");
        location.href = "index.html";
        currentUser = "";
    }

    function showUserInfo(currentUser, id, listener) {
        document.getElementById("greeting").innerText = `Hello ${currentUser.username}!`;
        let userInfo = `<table id=${id}>`
        for (const key in currentUser) {
            if (key === "pass") {
                if (!listener) continue
                userInfo += `<tr><td>${key}:  *****</td></tr>`;
                continue
            }
            if (key === "securityQuestionAnswer") {
                if (!listener) continue
                else {
                    userInfo += `<tr><td>Answer:  ${currentUser[key]}</td></tr>`;
                    continue
                }
            }
            userInfo += `<tr><td>${key}:  ${currentUser[key]}</td></tr>`;
        };
        document.getElementById("main").innerHTML = userInfo + "</table>";
        if (listener) {
            document.getElementById(id).addEventListener("click", editUserInfo);
        }
    }

    function login(event) {
        event.preventDefault();
        let username = document.getElementById("username");
        let pass = document.getElementById("pass");
        let message = "Please fill the following fields:";
        if (username.value === "") message += " Username field,";
        if (pass.value === "") message += " Password field,";
        if (checkEmptyFields("username", "pass")) {
            alert(message.replace(/.$/, "."));
            return
        };
        if (checkUser("users", "username", username.value) && checkUser("users", "pass", pass.value)) {
            document.getElementById("username").classList.remove("red-border");
            document.getElementById("pass").classList.remove("red-border");
            document.getElementById("logged-user").style.display = "block";
            document.getElementById("logged-user").textContent = `Logged in as ${username.value}`;
            alert("Logged in!");
            checkEmptyFields("username", "pass");
            sessionStorage.setItem("currentUser", JSON.stringify(pullUser("users", "username", username.value)));
            location.href = "logged.html";
        } else if (!checkUser("users", "username", username.value)) {
            document.getElementById("username").focus();
            document.getElementById("username").classList.add("red-border");
            alert("Username does not exist!");
        } else if (!checkUser("users", "pass", pass.value)) {
            document.getElementById("pass").focus();
            document.getElementById("pass").classList.add("red-border");
            document.getElementById("forgot-pass").style.display = "block";
            alert("Password incorect!");
        };
    }

    function register(event) {
        let message = "Please fill the following fields:"
        let username = document.getElementById("username-reg");
        let pass = document.getElementById("pass-reg");
        let passConf = document.getElementById("confirm-pass");
        let question = document.getElementById("security-question");
        let qAnswer = document.getElementById("security-question-answer");
        event.preventDefault();
        if (username.value === "") message += " Username field,";
        if (pass.value === "") message += " Password field,";
        if (passConf.value === "") message += " Confirm password field,";
        if (qAnswer.value === "") message += " Security question field,";
        if (checkEmptyFields("username-reg", "pass-reg", "confirm-pass", "security-question", "security-question-answer")) {
            alert(message.replace(/.$/, "."));
            return
        } else message = "";
        let users = LS.get("users");
        if (pullUser("users", "username", username.value)) {
            alert("Username in use!");
            username.classList.add("red-border");
            username.focus();
            return
        };
        if (pass.value !== passConf.value) {
            alert("Confirm password field does not match password");
            passConf.classList.add("red-border");
            passConf.focus();
            return
        }
        users.push({
            username: username.value,
            pass: pass.value,
            "Security question": question.value,
            securityQuestionAnswer: qAnswer.value,
            "Date of birth": "",
            Gender: "",
            Bio: "",
            Interests: []
        });
        LS.set("users", users);
        alert("Registration successful! You can now login.");
        checkEmptyFields("username-reg", "pass-reg", "confirm-pass", "security-question", "security-question-answer");
        goToRegister(false);
    };

    function checkEmptyFields(...elements) {
        return elements.reduce((acc, element, index) => {
            if (!document.getElementById(element).value) {
                document.getElementById(element).focus();
                document.getElementById(element).classList.add("red-border");
                acc = true;
                return acc
            } else {
                document.getElementById(element).classList.remove("red-border");
            }
        }, false)
    }

    function goToRegister(event) {
        if (event) event.preventDefault();
        if (document.getElementById("register").textContent !== "Already registered? Login.") {
            document.getElementById("login-form").style.display = "none";
            document.getElementById("register-form").style.display = "block";
            document.getElementById("register").textContent = "Already registered? Login.";
        } else {
            document.getElementById("login-form").style.display = "block";
            document.getElementById("register-form").style.display = "none";
            document.getElementById("register").textContent = "Not registered?";
        }
    }

    function checkUser(listName, property, value) {
        let users = LS.get(listName);
        for (let i = 0; i < users.length; i++) {
            if (users[i][property] === value) return true
        };
        return false
    }

    function pullUser(listName, property, value) {
        let users = LS.get(listName);
        for (let i = 0; i < users.length; i++) {
            if (users[i][property] === value) return users[i]
        };
    }

    function setUser(listName, user) {
        let users = LS.get(listName);
        users.push(user);
        LS.set(listName, users);
    }

})();














