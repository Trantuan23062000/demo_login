module.exports = (req, res, next)=> {
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      if (![email, name, password].every(Boolean)) {
        return res.status(401).json("Khong du thong tin dang ki !");
      } else if (!validEmail(email)) {
        return res.status(401).json("Email khong dung dinh dang !");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Vui long dien du email va password !");
      } else if (!validEmail(email)) {
        return res.status(401).json("Email khong dung dinh dang !");
      }
    }
  
    next();
  };