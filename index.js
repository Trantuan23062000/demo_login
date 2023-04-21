const express = require('express')
const app = express()
const cors = require('cors')

var acl = require('acl');
 


 
// Or Using the memory backend
acl = new acl(new acl.memoryBackend());


// guest is allowed to view blogs
acl.allow('guest', 'blogs', 'view')
 
// allow function accepts arrays as any parameter
acl.allow('member', 'blogs', ['edit', 'view', 'delete'])

acl.addUserRoles('joed', 'guest')

acl.addRoleParents('baz', ['foo', 'bar'])

acl.allow('foo', ['blogs', 'forums', 'news'], ['view', 'delete'])

acl.allow('admin', ['blogs', 'forums'], '*')

// acl.allow([
//     {
//         roles:['guest', 'member'],
//         allows:[
//             {resources:'blogs', permissions:'get'},
//             {resources:['forums', 'news'], permissions:['get', 'put', 'delete']}
//         ]
//     },
//     {
//         roles:['gold', 'silver'],
//         allows:[
//             {resources:'cash', permissions:['sell', 'exchange']},
//             {resources:['account', 'deposit'], permissions:['put', 'delete']}
//         ]
//     }
// ])

// acl.isAllowed('joed', 'blogs', 'view', function(err, res){
//     if(res){
//         console.log("User joed is allowed to view blogs")
//     }
// })

// acl.isAllowed('jsmith', 'blogs', ['edit', 'view', 'delete'])

// acl.allowedPermissions('james', ['blogs', 'forums'], function(err, permissions){
//     console.log(permissions)
// })



//middleware


app.use(express.json())
app.use(cors())


//routers
app.use("/auth", require("./routes/auth.js"))
app.use("/home",require("./routes/home.js"))



app.listen(3456,()=>{
    console.log("server running on : port 3456");
})



