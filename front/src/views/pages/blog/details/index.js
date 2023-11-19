// ** React Imports
import {Fragment, useState, useEffect, useRef} from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import {

    Bookmark,
    MessageSquare, Trash2
} from 'react-feather'

// ** Utils
import { kFormatter } from '@utils'

// ** Custom Components
import Sidebar from '../BlogSidebar'
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,

  Badge,

  Button,
  CardImg,
  CardBody,
  CardText,
  CardTitle,
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-blog.scss'

// ** Images
import {Link, useLocation} from "react-router-dom";

const BlogDetails = () => {
  // ** States

  const location = useLocation();
  const currentUrl = location.pathname;
  const id = currentUrl.split('/')[4]
  const [data, setData] = useState(null)
  const [comments , setComments] = useState([]);
  const [comment , setComment] = useState('');
  const commentsRef = useRef(); // this is used to scroll to the bottom of the comments section
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('userData')));// on recupere le profile de l'utilisateur a partir de reducer auth.js

    useEffect(() => {
        if(user) {
            axios.get(`/posts/${id}`).then(res => {
                setData(res.data);
            })
        } else (navigation.navigate('/auth/not-auth'))
    }, [id])

  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }

  const renderTags = () => {
      return data.tags.map((tag, index) => {
      return (
        <a key={index} href='/' onClick={e => e.preventDefault()}>
          <Badge
            className={classnames({
              'me-50': index !== data.tags.length - 1
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
     const  commentPost = (value, id) => async () => {
        try {
             await axios.post(`/posts/${id}/commentPost`, { value });
             const { data } = await axios.get(`/posts/${id}`);
             setData(data);
            }
            catch (error) {
            console.log(error);
        }
        console.log(data.creator)
     }

    const handleClick = async () => {
        const finalComment = `${user?.name}: ${comment}`;
        const newComments = await commentPost(finalComment,data._id);
        setComments(newComments);
        setComment('');

    };

    const  uncommentPost = (comment, id) => async () => {

        try {
            await axios.put(`/posts/${id}/uncomment`, { comment });
            const { data } = await axios.get(`/posts/${id}`);
            setData(data);
            }
        catch (error) {
            console.log(error);

        }
    }


     const handleBuy = () => {
        console.log('buy')
     }


    commentsRef.current?.scrollIntoView({behavior: "smooth"} ); // this is used to scroll to the bottom of the comments section


    const renderComments = () => {


        return data.comments.map(comment => {
            return (
                <Card className='mb-3' key={comment._id}>
                    <CardBody>


                        <div className='d-flex'>
                            <div className='d-flex justify-content-between'>
                                <div style={{marginRight: '10px'}}>
                                    { user?.role === "admin"  &&
                                    (
                                        <Button
                                        disabled={user?.name !== comment.split(":")[0]}
                                            className='ms-2'
                                            color='flat-danger'
                                            onClick={uncommentPost(comment, data._id)}
                                        style={{ outline: 'none' }}
                                        size="sm"

                                        >
                                            <Trash2 />
                                        </Button>

                                    )}

                                </div>
                            <div>
                                <Avatar className='me-75' img={user?.profilePicture} imgHeight='38' imgWidth='38' />
                            </div>









                                <CardText>
                                    <div className='text-body align-middle'>{kFormatter(comment)}</div>
                                </CardText>


                            <div ref={commentsRef} />

                        </div>
                        </div>

                    </CardBody>

                </Card>
            )
        })
    }


    return (
    <Fragment>
        <div className='d-flex justify-content-flex-start'>

            <div style={{ marginLeft: '10px' , marginBottom : '20px' , fontSize : '30px' , fontWeight: 'normal', fontFamily: 'Montserrat' }}>
                Program Details
            </div>

            <div style={{ marginTop: '8px', marginLeft: '10px' , fontSize : '20px' , fontWeight: 'lighter' }}>
                | <Link to='/dashboard/ecommerce'>  Home ></Link><Link to='/pages/programs/list'> List </Link>> Details
            </div>


        </div>

        <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data !== null ? (
              <Row>
                <Col sm='12'>
                  <Card className='mb-3'>
                    <CardImg className='img-fluid' src={data.selectedFile} alt={data.title} style={{width: '1138px', height: '400px', display: 'block', margin: '11px auto 0'}}  />
                    <CardBody>
                      <CardTitle tag='h4' style={{textAlign: 'center'}}
                      >{data.title}</CardTitle>
                        <CardText className='mb-2'>
                            <span className='text-muted ms-50 me-25'>|</span>
                            <small className='text-muted'>{data.message}</small>
                        </CardText>

                      <div className='d-flex'>
                        <Avatar className='me-50' img={data.selectedFile} imgHeight='24' imgWidth='24' />
                        <div>
                          <small className='text-muted me-25'>by</small>
                          <small>
                            <a className='text-body' href='/' onClick={e => e.preventDefault()}>
                                {/* {item.creator} */}
                                khalil turki
                            </a>
                          </small>

                          <span className='text-muted ms-50 me-25'>|</span>
                          <small className='text-muted'>{      new Intl.DateTimeFormat('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(data.createdAt)) }</small>
                        </div>
                      </div>
                      <div className='my-1 py-25'>{renderTags()}</div>
                      {/*
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data.blog.content
                        }}
                      ></div>
                      */}

                      <hr className='my-2' />
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex align-items-center me-1'>
                            <a className='me-50' href='/' onClick={e => e.preventDefault()}>
                              <MessageSquare size={21} className='text-body align-middle' />
                            </a>

                          </div>
                          <div className='d-flex align-items-cente'>
                            <a className='me-50' href='/' onClick={e => e.preventDefault()}>
                              <Bookmark size={21} className='text-body align-middle' />
                            </a>
                            {/*

                            <a href='/' onClick={e => e.preventDefault()}>
                              <div className='text-body align-middle'>{data.blog.bookmarked}</div>
                            </a>
                            */}
                          </div>
                        </div>
                       <button className='btn btn-primary' onClick={handleBuy} style={{width: '100px', height: '40px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: 'Montserrat'}}>
                           buy
                       </button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col sm='12' id='blogComment'>
                  <h6 className='section-label'>Comment</h6>
                  {renderComments()}
                </Col>

                  <div style={{ width: '80%' }}>
                      <textarea
                          className='form-control'
                          rows={5}
                          placeholder='Type your comment here...'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required={true}
                      />
                      <Button style={{ marginTop: '10px' }}  disabled={!comment.length} variant="contained" color="primary" onClick={handleClick} > comment </Button>
                  </div>

              </Row>
            ) : null}
          </div>
        </div>
        <Sidebar />
      </div>
    </Fragment>
  )
}

export default BlogDetails
