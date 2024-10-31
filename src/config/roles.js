const AccessControl = require('accesscontrol');
const { json } = require('body-parser');


let grantRole={
    admin:{
      profile:{
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
      },
      bus:{
        "create:any":["*"],
        "read:any":["*"],
        "update:any":["*"],
        "delete:any":["*"]
      },
      driver:{
        "create:any":["*"],
        "read:any":["*"],
        "update:any":["*"],
        "delete:any":["*"]
      },
      user:{
        "create:any":["*"],
        "read:any":["*"],
        "update:any":["*"],
        "delete:any":["*"]
      },

    },
    user:{
        profile:{
        
        'read:own': ['*',"!_id","!password","firstname","lastname"],
        'update:own': ['*']
       
        }

    }
    ,driver:{
      profile:{
        
        'read:own': ['*',"!_id","!password","firstname","lastname"],
        'update:own': ['*']
       
        },
        bus:{
        
          "read:any":["*"],
        "update:any":["*"],
         
          },


    }
}
const roles=new AccessControl( grantRole);
exports.permissions=function(action,resource){
  return async (req,res,next)=>{
    try {
      const permission = await roles.can(req.user.role)[action](resource);
     
      if (!permission.granted){
        res.status(401).json("user permission not granted")
       
      } 
      res.locals.permission=permission;
    
      next()
      
    } catch (error) {
      next(error)
      
    }
  }
   

  
}

    
  




