import { lazy } from "react";

const KnowledgeBase = lazy(() => import('../../views/pages/knowledge-base/KnowledgeBase'))
const KnowledgeBaseCategory = lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategory'))
const KBCategoryQuestion = lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategoryQuestion'))


const PagesRoutes = [
  {
    path: '/pages/knowledge-base',
    element: <KnowledgeBase />
  },
  {
    path: '/pages/knowledge-base/:entryId',
    element: <KBCategoryQuestion />
  },
  // {
  //   path: '/pages/knowledge-base/:category/:question',
  //   element: <KBCategoryQuestion />
  // },
]

export default PagesRoutes
