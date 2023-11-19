// ** React Imports
import {Link, useLocation} from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import {Edit, MessageSquare, Plus, Trash2} from 'react-feather'

// ** Custom Components
import Sidebar from '../BlogSidebar'
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge,
  UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-blog.scss'
import AddNewModal from "./AddNewModal";
import {ThumbUpAltOutlined} from "@material-ui/icons";
import Pagination from './Pagination'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MySwal from "sweetalert2";


const BlogList = () => {


  // ** States
  const [data, setData] = useState(null)
  const [modal, setModal] = useState(false)

  const [user,setUser] = useState(JSON.parse(localStorage.getItem('userData')));

  //const [user,setUser] = useState(JSON.parse(localStorage.getItem('profile'))); // on recupere le profile de l'utilisateur a partir de reducer auth.js
 // const userId = user?.result.googleId || user?.result?._id;
  const [likes, setLikes] = useState([data?.likes]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('searchQuery');
  const tags = new URLSearchParams(location.search).get('tags');
  const page = new URLSearchParams(location.search).get('page') || 1;

  useEffect(() => {
    if (user) {

    if (searchQuery || tags ) {
      axios.get(`/posts/search?searchQuery=${searchQuery || 'none'}&tags=${tags || 'none'}`)
          .then(res => {
            setData(res.data.data);

            })
            .catch(err => console.log(err));
      console.log ("search")
    } else {
       axios.get(`/posts?page=${page}`)
          .then(res => {
            setData(res.data.data);
          })
          .catch(err => console.log(err));
        console.log ("no search")
    }
    }else (navigation.navigate('/auth/not-auth'))
    }, []);




  const deletePost = (id) => async () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        try {
          axios.delete(`/posts/${id}`);
          setData(data.filter((post) => post._id !== id));
        } catch (error) {
          console.log(error);
        }
      };


      MySwal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your program has been deleted.',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })

    })
  }







  const handleModal = () => {
    setModal(!modal)
    setData(data)

  }



  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }
  const renderRenderList = () => {

    return data.map(item => {
      const formattedDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(item.createdAt));

      const like = async (id) => {
        try {
          const userId = user.id;
          await axios.patch(`/posts/${id}/likePost/${userId}`);
          const updatedData = data.map((post) => {
            if (post._id === id) {
              const hasLikedPost = post.likes.includes(userId);
              const likes = hasLikedPost ? post.likes.filter((id) => id !== userId) : [...post.likes, userId];
              return { ...post, likes };
            } else {
              return post;
            }
          });
          setData(updatedData);
        } catch (error) {
          console.log(error);
        }
      };



      const handleLike = async (id) => {
        try {

            await like(id);


        } catch (error) {
          console.log(error);
        }
      };








      const Likes = () => {
        const hasLikedPost = item.likes.includes(user.id);

        const likeButtonStyle = {
          color: hasLikedPost ? 'blue' : 'inherit', // Change color to blue if post is liked
          cursor: 'pointer', // Add cursor pointer to show the button is clickable
        };

        if (item.likes.length > 0) {
          return likes.find((like) => like === user.id)
              ? (
                  <><ThumbUpAltIcon style={likeButtonStyle} fontSize="small" />&nbsp;{item.likes.length > 2 ? `You and ${item.likes.length - 1} others` : `${item.likes.length} like${item.likes.length > 1 ? 's' : ''}` }</>
              ) : (
                  <><ThumbUpAltOutlined style={likeButtonStyle} fontSize="small" />&nbsp;{item.likes.length} {item.likes.length === 1 ? 'Like' : 'Likes'}</>
              );
        }

        return <><ThumbUpAltOutlined style={likeButtonStyle} fontSize="small" />&nbsp;Like</>;
      };



      const renderTags = () => {
        return item.tags.map((tag, index) => {
          return (

            <a key={index} href='/' onClick={e => e.preventDefault()}>

              <Badge

                className={classnames({
                  'me-50': index !== item.tags.length - 1
                })}
                color={badgeColorsArr[tag]}
                pill
              >
                {tag}
              </Badge>

            </a>
          )
        })
      }



      return (



        <Col key={item.title} md='6'>
          <Card>

            <Link to={`/pages/programs/detail/${item._id}`}>
              <CardImg className='img-fluid' src={item.selectedFile} alt={item.title} style={{width: '538px', height: '200px', display: 'block', margin: '11px auto 0'}}  />
            </Link>
            <CardBody>
              <CardTitle tag='h4'>
                <Link className='blog-title-truncate text-body-heading' to={`/pages/programs/detail/${item._id}`}>
                  {item.title}
                </Link>
                <span className='text-muted ms-50 me-25'>|</span>
                <small className='text-muted'>{item.message}</small>
              </CardTitle>
              <div className='d-flex'>
                <Avatar className='me-50' img={item.selectedFile} imgHeight='24' imgWidth='24' />
                <div>
                  <small className='text-muted me-25'>by</small>
                  <small>
                    <a className='text-body' href='/' onClick={e => e.preventDefault()}>
                      {/* {item.creator} */}
                      khalil turki
                    </a>
                  </small>

                </div>
                <div className='ms-auto'>
                  <small className='text-muted'>{formattedDate}</small>
              </div>
                </div>
              <div className='my-1 py-25'>{renderTags()}</div>
              <CardText className='blog-content-truncate'>{item.excerpt}</CardText>
              <hr />
              <div className='d-flex justify-content-between align-items-center'>
                <Link to={`/pages/programs/detail/${item._id}`}>
                  <MessageSquare size={15} className='text-body me-50' />
                  <span className='text-body fw-bold'> Comments {item.comments.length}</span>
                </Link>



                <div className='demo-inline-spacing'>
                  {user?.role=="admin"&& (
                  <UncontrolledButtonDropdown>
                    <DropdownToggle color='primary' caret outline >
                     Admin Actions
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem href={`/pages/programs/edit/${item._id}`} tag='a'> <Edit />Edit   </DropdownItem>
                      <DropdownItem  onClick={deletePost(item._id)} tag='a'><Trash2 /> <span className='align-middle ml-50' style={{ color: 'red' }}>Delete</span></DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                  )}
                </div>
                {/*  disabled={!user?.result} */}
                <Button size="small"
                        boredercolor="blue"
                        color="blue"
                        backgroundcolor="primary"
                        style={{ '&:hover': { backgroundColor: 'blue', color: 'white' } }}
                        onClick={() => handleLike(item._id)}>
                  <Likes />
                </Button>
              </div>

            </CardBody>

          </Card>
        </Col>
      )
    })
  }

  return (
    <Fragment>

      <div className='d-flex justify-content-flex-start'>

        <div style={{ marginLeft: '10px' , marginBottom : '20px' , fontSize : '30px' , fontWeight: 'normal', fontFamily: 'Montserrat' }}>
          Program List
        </div>

        <div style={{ marginTop: '8px', marginLeft: '10px' , fontSize : '20px' , fontWeight: 'lighter' }}>
          | <Link to='/dashboard/ecommerce'>  Home ></Link> List
        </div>

        <div style={{ marginLeft: 'auto' }}>

          {user?.role=="admin"&& (
          <Button
              className='ms-2'
              color='#5A8DEE'
              onClick={handleModal}
              style={{
                backgroundColor: 'rgba(118 113 175)',
                borderRadius: '200%'
              }}
          >

            <Plus size={25} color='white' />

            </Button>
          )}
        </div>
      </div>



      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data !== null ? (
              <div className='blog-list-wrapper'>
                <Row>{renderRenderList()}</Row>
                <Row>
                  <Col sm='12'>
                    {!searchQuery && ! data.tags && (

                        <div style={{marginLeft: '500px'}}>
                          <Pagination page={page} />
                        </div>

                    )}
                  </Col>
                </Row>
              </div>
            ) : null}
          </div>
        </div>

        <Sidebar />




      </div>
      <AddNewModal open={modal} handleModal={handleModal}  />

    </Fragment>
  )
}



export default BlogList


