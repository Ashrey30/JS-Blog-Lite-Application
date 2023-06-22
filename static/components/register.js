const register = {
    template:`
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
            <a class="navbar-brand">Register</a>
            </div>
        </nav>
        
        <div class="water">
            <div class="form-box">
                <form id="register" class="inputs" action="" method="POST">
                    <input type="file" name="pfp" id="pfp" class="input-fields" placeholder="Upload Profile Pic" required>
                    <input type="email" name="email" id="email" class="input-fields" placeholder="Email ID" v-model="formData.email" required>
                    <input type="text" name="username" id="username" class="input-fields" placeholder="Username" v-model="formData.username" required>
                    <input type="password" name="password1" id="password1" class="input-fields" placeholder="Password" v-model="formData.password" required>
                    <input type="password" name="password2" id="password2" class="input-fields" placeholder="Confirm Password" required>
                    <button type="submit" @click.prevent='registerUser' class="submit-btn">Register</button>
                    Already have an account? <router-link to="/">Login Here</router-link>
                </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            formData:{
                email: "",
                username: "",
                password: ""
            }
        }
    },

    methods: {
        async registerUser(){
            if(this.check()){
                const image = document.getElementById("pfp").files[0];
                const formData = new FormData();
                formData.append("pfp", image)
                formData.append("username", this.formData.username)
                formData.append("email", this.formData.email)
                formData.append("password", this.formData.password)

                const res = await fetch('/api/users',{
                    method: "POST",
                    body: formData
                })
                if (res.status != 409) {
                    const data = await res.json()
                    if (res.ok) {
                        alert('Account created. Please Login now')
                        return this.$router.push('/')
                    } else {
                        alert(data.error_message)
                    }
                }
                else {
                    alert('Please use a different email')
                }
            }
        },

        check(){
            var email = document.getElementById("email").value
            var username = document.getElementById("username").value 
            var password1 = document.getElementById("password1").value
            var password2 = document.getElementById("password2").value 
            
            if (! /.+@.+\.com$/.test(email)) {
                alert("PLease provide a valid Email ID")
                return false
            }
            if(username.length == 0){
                alert("Please enter a username")
                return false
            }
            if(password1.length == 0){
                alert("Please enter a password")
                return false
            }
            if(password2.length == 0){
                alert("Please enter a password")
                return false
            }
            if (/ /.test(email)) {
                alert("Remove spaces from Email ID")
                return false
            }
            if(/ /.test(password1) || / /.test(password2)){
                alert("Passwords cannot contain spaces")
                return false
            }
            if(password1 == password2){
                return true
            } else{
                alert("Passwords does not match")
                return false
            }
        }
    },
}

export default register