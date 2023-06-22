const update_profile = {
    template:`
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand">Edit Profile</a>
            </div>
        </nav>

        <div class="water">
            <div class="form-box">
                <form id="register" action="" class="inputs" @submit.prevent="updateProfile">
                    <input type="email" name="email" id="email" class="input-fields" placeholder="Email ID" v-model="formData.email" required>
                    <input type="text" name="username" id="username"class="input-fields" placeholder="Username(disabled)" v-model="formData.username" disabled>
                    <input type="password" name="password1" id="password1" class="input-fields" placeholder="Password" v-model="formData.password" required>
                    <input type="password" name="password2" id="password2" class="input-fields" placeholder="Confirm Password" required>
                    <button type="submit" class="submit-btn">Update Profile</button>
                </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            formData:{
                username: localStorage.getItem("username"),
                email: localStorage.getItem("email"),
                password: ""
            }
        }
    },

    methods: {
        async updateProfile(){
            if(this.check()){
                const res = await fetch('/api/users',{
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.formData)
                })
                if (res.status != 409) {
                    const data = await res.json()
                    if (res.ok) {
                        alert('Account successfully updated.')
                        return this.$router.push('/profile_page')
                    } else {
                        alert('Error Occured.')
                    }
                }
                else {
                    alert('Please use a different email')
                }
            }
        },

        check(){
            var email = document.getElementById("email").value
            var password1 = document.getElementById("password1").value
            var password2 = document.getElementById("password2").value 
            
            if (! /.+@.+\.com$/.test(email)) {
                alert("Please provide a valid Email ID")
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

export default update_profile