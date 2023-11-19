import { lazy } from 'react'
import {Navigate} from "react-router-dom";
import Home2 from "@src/views/pages/exercises/pages/Home2";

const Faq = lazy(() => import('../../views/pages/faq'))
const ApiKey = lazy(() => import('../../views/pages/api-key'))
const Profile = lazy(() => import('../../views/pages/profile'))
const Pricing = lazy(() => import('../../views/pages/pricing'))
const License = lazy(() => import('../../views/pages/license'))
const Error = lazy(() => import('../../views/pages/misc/Error'))
const BlogList = lazy(() => import('../../views/pages/blog/list'))
const BlogEdit = lazy(() => import('../../views/pages/blog/edit'))
const BlogDetails = lazy(() => import('../../views/pages/blog/details'))
const ComingSoon = lazy(() => import('../../views/pages/misc/ComingSoon'))
const ModalExamples = lazy(() => import('../../views/pages/modal-examples'))
const Maintenance = lazy(() => import('../../views/pages/misc/Maintenance'))
const AccountSettings = lazy(() => import('../../views/pages/account-settings'))
const NotAuthorized = lazy(() => import('../../views/pages/misc/NotAuthorized'))
const LifestyleTracking = lazy(() => import('../../views/pages/lifestyle-tracking'))
const Analysis = lazy(() => import('../../views/pages/lifestyle-tracking/nav-bar-options/Analysis'))

const Recipes = lazy(() => import('../../views/pages/lifestyle-tracking/nav-bar-options/Recipes'))

const AddItem = lazy(() => import('../../views/pages/lifestyle-tracking/nav-bar-options/AddItem'))
const Home = lazy(() => import('../../views/pages/exercises/pages/Home'))
const ExerciseDetail = lazy(() => import('../../views/pages/exercises/pages/ExerciseDetail'))
// Component for adding entries 

const AddEnergy = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/AddEnergy.js'))
const AddExercise = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/AddExercise.js'))
const AddSleep = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/AddSleep.js'))
const AddSymptoms = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/AddSymptoms.js'))

// Food entry 
const FoodEntry = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/food/FoodEntry'))
const DrinkEntry = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/drink/DrinkEntry'))
const FoodEdit = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/food/FoodEdit'))
const DrinkEdit = lazy(() => import('../../views/pages/lifestyle-tracking/add-entries/drink/DrinkEdit'))




const PagesRoutes = [
  {
    path: '/pages/profile',
    element: <Profile />
  },
  {
    path: '/pages/faq',
    element: <Faq />
  },
  {
    path: '/pages/diary',
    element: <LifestyleTracking />
  },
  {
    path: '/pages/analysis',
    element: <Analysis />
  },
  {
    path: '/pages/diary/add-item',
    element: <AddItem />
  },
  {
    path: '/pages/recipes',
    element: <Recipes />
  },
  {
    path: '/pages/add/Energy',
    element: <AddEnergy />
  },
  {
    path: '/pages/add/Exercise',
    element: <AddExercise />
  },
  {
    path: '/pages/add/Sleep',
    element: <AddSleep />
  },
  {
    path: '/pages/add/Symptoms',
    element: <AddSymptoms />
  },
  {
    path: '/pages/add/Foods',
    element: <FoodEntry />
  },
  {
    path: '/pages/add/Drinks',
    element: <DrinkEntry />
  },
  {
    path: '/pages/edit/Foods',
    element: <FoodEdit />
  },
  {
    path: '/pages/edit/Drinks',
    element: <DrinkEdit />
  },


  {
    path: '/pages/account-settings',
    element: <AccountSettings />
  },
  {
    path: '/pages/license',
    element: <License />
  },
  {
    path: '/pages/api-key',
    element: <ApiKey />
  },
  {
    path: '/pages/modal-examples',
    element: <ModalExamples />
  },
  {
    path: '/pages/programs/list',
    element: <BlogList />
  },
  {
    path: '/pages/programs/search',
    element: <BlogList />
  },
  {
    path: '/pages/programs/detail/:id',
    element: <BlogDetails />
  },
  {
    path: '/pages/programs/edit/:id',
    element: <BlogEdit />
  },
  {
    path: '/pages/programs/edit',
    element: <Navigate to='/pages/programs/edit' />
  },
  {
    path: '/pages/exercises/listexercises',
    element: <Home2 />
  },
  {
    path: '/pages/exercises/list',
    element: <Home />
  },

  {
    path: 'exercise/:id',
    element: <ExerciseDetail />
  },

  {
    path: '/pages/pricing',
    element: <Pricing />
  },
  {
    path: '/misc/coming-soon',
    element: <ComingSoon />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/not-authorized',
    element: <NotAuthorized />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/maintenance',
    element: <Maintenance />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  },
  {
    path: '/misc/error',
    element: <Error />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  }
]

export default PagesRoutes
