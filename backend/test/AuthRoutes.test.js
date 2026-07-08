import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import request from "supertest";

import express from "express";

vi.mock(
  "../controllers/AuthController.js",
  ()=>({

    login:
      (req,res)=>{

        return res.status(200)
        .json({

          success:true,

          message:
            "Login successful.",

        });

      },

    logout:
      (req,res)=>{

        return res.status(200)
        .json({

          success:true,

          message:
            "Logout successful.",

        });

      },

    currentUser:
      (req,res)=>{

        return res.status(200)
        .json({

          success:true,

          user:{
            email:
              "admin@gmail.com"
          }

        });

      },

  })
);

vi.mock(
  "../middleware/AuthMiddleware.js",
  ()=>({


    authenticate:
      (req,res,next)=>next()

  })
);

import AuthRoutes from "../routes/AuthRoutes.js";

const app = express();

app.use(
  express.json()
);

app.use(
  "/api/auth",
  AuthRoutes
);


describe(
"Authentication Routes",
()=>{


it(
"It should login user through POST /api/auth/login.",
async()=>{


const response =
await request(app)
.post(
"/api/auth/login"
)
.send({

email:
"admin@gmail.com",

password:
"admin123"

});

expect(
response.status
)
.toBe(200);

expect(
response.body.message
)
.toBe(
"Login successful."
);

});


it(
"It should logout user through POST /api/auth/logout.",
async()=>{

const response =
await request(app)
.post(
"/api/auth/logout"
);

expect(
response.status
)
.toBe(200);

expect(
response.body.message
)
.toBe(
"Logout successful."
);

});


it(
"It should retrieve current user through GET /api/auth/me.",
async()=>{

const response =
await request(app)
.get(
"/api/auth/me"
);

expect(
response.status
)
.toBe(200);

expect(
response.body.user.email
)
.toBe(
"admin@gmail.com"
);

});

});