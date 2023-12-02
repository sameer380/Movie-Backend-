const  Admin  = require("../models/Admin");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const addAdmin = async (req, res, next) => { 
    const { email, password } = req.body;
    if ( !password || !email) {
		return res.status(422).json({ message: "Invalid Inputs" });
	}
    let existingAdmin;
    try { 
      existingAdmin= await Admin.findOne({email})
    } catch (err) {
        return console.log(err);
    }

    if (existingAdmin)
    {
        return res.status(400).json({ message: "Admin already exist" });
    }
    
    let admin;
    const hashedPassword = bcrypt.hashSync(password,10)
    
    try {
        admin = new Admin({ email, password });
        admin = await admin.save();
    } catch (e) { return console.log(e);}

    if (admin) { 
        return res.status(200).json({message:"Successfully admin saved"})
    }
        
}


const adminLogin = async (req, res) => { 

    const { email, password } = req.body;
     if (!password || !email) {
				return res.status(422).json({ message: "Invalid Inputs" });
    }

    try {
        const admin = await Admin.findOne({ email: email })
        if (!admin) {
            return res.status(404).json({ message: "Cannot find the Admin" });
       
        }
        const isMatch = await bcrypt.compare(password, admin.password);
      
        // if (!isMatch) {
        //     return res.status(400).json({ message: "Incorrect Password" });
        // }
        
        const token = jwt.sign({ id: admin._id }, "sameer",
            {
                expiresIn:"7d"
            }
            );
            return res.status(200).json({ message: "Authentication Completed" ,token,id:admin._id});
        
    } catch (e) {
        console.log(e);
    }

}


const getAdmins = async (req, res) => {
    let admins;
    try {
        admins = await Admin.find();

    }
    catch (err) { console.log(err) }
    
    if (!admins) {
        return res.status(500).json({ message: "Internal server error" })
    }

    return res.status(200).json({ admins });
}


const getAdminById= async(req,res) => { 
    const id = req.params.id;
    let admin;
    try {
        admin = await Admin.findById(id).populate("addedMovies")

    
    }
    catch (err) { 
        return console.log(err);
    }

    if (!admin) {
        return console.log("Connot find Admin");

    }
    return res.status(200).json({admin})

}
module.exports = { addAdmin, adminLogin, getAdmins, getAdminById };