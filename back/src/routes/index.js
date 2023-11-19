import express from 'express';
import authRoute from './auth/jwt.route.js';
import userRoute from './user.route.js';
import docsRoute from './docs.route.js';
import categoryRouter from './category.route.js';
import config from '../config/config.js';
import productRouter from './product.route.js';
import roleRouter from './role.route.js';
import permissionRouter from './permission.route.js';
import wishlistRouter from './wishlist.route.js';
import cartRouter from './cart.route.js';
import webauthnRouter from './auth/webauthn.route.js';
import loginWithGoogleRouter from './loginWithGoogle.route.js';
import postRoutes from './posts.js';
import exerciseRoutes from './exercises.route.js';
import day from './day.route.js'
import taskRoutes from './task.route.js';
import analysis from './analysis.js'
import exercise from './exercise.js'
import drinks from './drinks.js'
import energy from './energy.js'
import ingredients from './ingredients.js'
import symptoms from './symptoms.js'
import sleep from './sleep.js'






const router = express.Router();
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/webauthn',
    route: webauthnRouter,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRouter,
  },
  {
    path: '/products',
    route: productRouter,
  },
  {
    path: '/roles',
    route: roleRouter,
  },
  {
    path: '/permissions',
    route: permissionRouter,
  },
  {
    path: '/wishlist',
    route: wishlistRouter,
  },
  {
    path: '/cart',
    route: cartRouter,
  },
  {
    path: '/loginWithGoogle',
    route: loginWithGoogleRouter,
  },
  {
    path: '/auth/user',
    route: userRoute,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/exercises',
    route: exerciseRoutes,
  },
  {
    path: '/tasks',
    route: taskRoutes,
  },
  {
    path: '/analysis',
    route: analysis,
  },
  {
    path: '/sleep',
    route: sleep,
  },
  {
    path: '/symptoms',
    route: symptoms,
  },
  {
    path: '/ingredients',
    route: ingredients,
  },
  {
    path: '/exercice',
    route: exercise,
  },
  {
    path: '/energy',
    route: energy,
  },
  {
    path: '/drinks',
    route: drinks,
  },
  {
    path: '/days',
    route: day,
  },

];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];
defaultRoutes.forEach((route) => {
  if (route.middlewares) router.use(route.path, route.middlewares, route.route);
  else router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

router.use(loginWithGoogleRouter);
export default router;
