// ** Icons Import
import { FileText, Circle, Square, UserCheck, User } from 'react-feather'

export default [
  {
    id: 'exercises',
    title: 'Pages',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'profile',
        title: 'Profile',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/profile',
        collapsed: true
      },
      {
        id: 'diary',
        title: 'Lifestyle Tracking',
        icon: <User />,
        navLink: '/pages/diary'
      },
      {
        id: 'accountSettings',
        title: 'Account Settings',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/account-settings'
      },
     
      {
        id: 'faq',
        title: 'FAQ',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/faq'
      },
      
      {
        id: 'knowledgeBase',
        title: 'Knowledge Base',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/pages/knowledge-base',
      },
      {
        id: 'pricing',
        title: 'Pricing',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/pricing'
      },
      {
        id: 'license',
        title: 'License',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/license'
      },
      {
        id: 'api-key',
        title: 'API Key',
        icon: <Circle size={12} />,
        permissions: ['admin', 'editor'],
        navLink: '/exercises/api-key'
      },
      {
        id: 'blog',
        title: 'Blog',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'blogList',
            title: 'List',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/blog/list'
          },
          {
            id: 'blogDetail',
            title: 'Detail',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/blog/detail'
          },
          {
            id: 'blogEdit',
            title: 'Edit',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/blog/edit'
          }
        ]
      },
      {
        id: 'mailTemplate',
        title: 'Mail Template',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'welcomeTemp',
            title: 'Welcome',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-welcome.html',
            newTab: true,
            externalLink: true
          },
          {
            id: 'resetPassTemp',
            title: 'Reset Password',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-reset-password.html',
            newTab: true,
            externalLink: true
          },
          {
            id: 'verifyEmailTemp',
            title: 'Verify Email',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-verify-email.html',
            newTab: true,
            externalLink: true
          },
          {
            id: 'deactivateAccountTemp',
            title: 'Deactivate Account',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-deactivate-account.html',
            newTab: true,
            externalLink: true
          },
          {
            id: 'invoiceMailTemp',
            title: 'Invoice',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-invoice.html',
            newTab: true,
            externalLink: true
          },
          {
            id: 'promotionalMailTemp',
            title: 'Promotional',
            permissions: ['admin', 'editor'],
            navLink: 'https://pixinvent.com/demo/vuexy-mail-template/mail-promotional.html',
            newTab: true,
            externalLink: true
          }
        ]
      },
      {
        id: 'miscellaneous',
        title: 'Miscellaneous',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'comingSoon',
            title: 'Coming Soon',
            permissions: ['admin', 'editor'],
            navLink: '/misc/coming-soon',
            newTab: true
          },

          {
            id: 'notAuthorized',
            title: 'Not Authorized',
            permissions: ['admin', 'editor'],
            navLink: '/misc/not-authorized',
            newTab: true
          },
          {
            id: 'maintenance',
            title: 'Maintenance',
            permissions: ['admin', 'editor'],
            navLink: '/misc/maintenance',
            newTab: true
          },
          {
            id: 'error',
            title: 'Error',
            permissions: ['admin', 'editor'],
            navLink: '/misc/error',
            newTab: true
          }
        ]
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: <UserCheck size={20} />,
    children: [
      {
        id: 'login',
        title: 'Login',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'login-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/login-basic',
            newTab: true
          },
          {
            id: 'login-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/login-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'register',
        title: 'Register',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'register-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/register-basic',
            newTab: true
          },
          {
            id: 'register-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/register-cover',
            newTab: true
          },
          {
            id: 'multi-steps-register',
            title: 'Multi-Steps',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/register-multi-steps',
            newTab: true
          }
        ]
      },
      {
        id: 'forgot-password',
        title: 'Forgot Password',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'forgotPassword-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/forgot-password-basic',
            newTab: true
          },
          {
            id: 'forgotPassword-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/forgot-password-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'resetPassword',
        title: 'Reset Password',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'resetPassword-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/reset-password-basic',
            newTab: true
          },
          {
            id: 'resetPassword-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/reset-password-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'verify-email',
        title: 'Verify Email',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'verify-email-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/verify-email-basic',
            newTab: true
          },
          {
            id: 'verify-email-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/verify-email-cover',
            newTab: true
          }
        ]
      },
      {
        id: 'two-step',
        title: 'Two Steps',
        icon: <Circle size={12} />,
        children: [
          {
            id: 'two-steps-basic',
            title: 'Basic',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/two-steps-basic',
            newTab: true
          },
          {
            id: 'two-steps-cover',
            title: 'Cover',
            permissions: ['admin', 'editor'],
            navLink: '/exercises/two-steps-cover',
            newTab: true
          }
        ]
      }
    ]
  },
  {
    id: 'modal-examples',
    title: 'Modal Examples',
    icon: <Square size={12} />,
    permissions: ['admin', 'editor'],
    navLink: '/exercises/modal-examples'
  }
]
