// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'


// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText, Input, Button } from 'reactstrap'
import FileBase from 'react-file-base64';


// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/pages/page-blog.scss'
import {useLocation, useNavigate} from "react-router-dom";

import { Typography} from "@material-ui/core";
import { Link } from 'react-router-dom';




const BlogEdit = () => {

  const location = useLocation();
  const currentUrl = location.pathname;
  const id = currentUrl.split('/')[4];
  const history = useNavigate();





  // ** States
  const [ postData , setPostData ]= useState({  //postData is an object that contains the data of the post that we are going to create or update
    title: '', message: '', tags: '', selectedFile: ''});

  const [data, setData] = useState(null) ;



  useEffect(() => {
   axios.get(`/posts/${id}`)
        .then((response) => {
          setData(response.data);
          setPostData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [id, setData, setPostData]);


  //

  const handleSubmit  = async (e) => {
    e.preventDefault();

    if (id) {
      await updatePost({...postData, id});
    }
    else {
      await createPost({...data});
    }
    clear();
  };

  const clear = () => {
    setPostData({ title: '', message: '', tags: '', selectedFile: '' ,});
  }

  const createPost = async (post) => {
    try {
      const { data } = await axios.post('/posts', post);
      history(`/pages/programs/list`); //redirection vers la page du post créé
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (post) => {
    try {
      const { data } = await axios.patch(`/posts/${id}`, post);
      setPostData(data);
      history(`/pages/programs/list`); //redirection vers la page du post créé
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className='blog-edit-wrapper'>
      <div className='d-flex justify-content-flex-start'>

      <div style={{ marginLeft: '10px' , marginBottom : '20px' , fontSize : '30px' , fontWeight: 'normal', fontFamily: 'Montserrat' }}>
         Program Edit
      </div>

        <div style={{ marginTop: '8px', marginLeft: '10px' , fontSize : '20px' , fontWeight: 'lighter' }}>
          | <Link to='/dashboard/ecommerce'>  Home ></Link> <Link to='/pages/programs/list'> List </Link>> Edit
      </div>
        </div>

      {data !== null ? (
        <Row>
          <Col sm='12'>
            <Card>

              <CardBody>
                <div className='d-flex'>
                  <div>
                    <Avatar className='me-75' img={data.selectedFile} imgWidth='38' imgHeight='38' />
                  </div>
                  <div>
                    <h6 className='mb-25'>{data.creator}</h6>
                    <CardText> <small className='text-muted'>{new Intl.DateTimeFormat('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(data.createdAt)) }</small></CardText>
                  </div>
                </div>

                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div >
                    <div style={{ marginRight: '400px', marginLeft: '100px' }}>
                      <Typography variant="h6">{id ? '' : 'Creating Programme'}</Typography>
                      <div className="mt-2">
                        <div style={{ marginTop: '10px' }}>
                        Title
                        <Input style={{ marginTop: '10px' }} name="title" variant="outlined" label="Title" value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
                      </div>

                        <div style={{ marginTop: '10px' }}>

                        Message
                        <Input style={{ marginTop: '10px' }} name="message" variant="outlined" label="Message" multiline minRows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
                          </div>
                        <div style={{ marginTop: '10px' }}>
                        Tags <small className='text-muted'>(coma separated)</small>
                        <Input name="tags" variant="outlined" label="Tags (coma separated)" value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                        Image
                          <div className='d-flex flex-column flex-md-row' style={{ marginLeft: '0px', marginTop: '0px' }}>
                            <div style={{ marginTop: '10px'}}>

                              <img className='rounded me-2 mb-1 mb-md-0' src={postData.selectedFile} alt='featured img' width='200' height='100' />
                            </div>

                          </div>
                          <div style={{marginTop: '10px', marginLeft: '10px'}}>

                            <FileBase  style={{ marginTop: '10px' }} type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />

                          </div>
                        </div>

                      </div>
                    </div>




                  </div>
                  <Col className='mb-2' sm='12'>

                  </Col>
                  <div className='d-flex justify-content-end mt-1'>

                  <Button variant="contained" color="secondary" size="small" onClick={clear} style={{ marginTop: 10 , marginRight: 10}}>Clear</Button>
                  <Button  variant="contained" color="primary" size="small" type="submit" style={{ marginTop: 10 }} >Submit</Button>
                    </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </div>
  )
}

export default BlogEdit
