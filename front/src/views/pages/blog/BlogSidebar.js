// ** React Imports
import {Link, useNavigate} from 'react-router-dom'
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import {  TextField , Button } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import FormProgram from "@src/views/pages/blog/list/FormProgram";

// ** Custom Components












const BlogSidebar = () => {
    const [search, setSearch] = useState('');
    const history = useNavigate();
    const [tags, setTags] = useState([]);
  // ** States
    const [data, setData] = useState(null)
    const [modal, setModal] = useState(false)
    const [user,setUser] = useState(JSON.parse(localStorage.getItem('userData')));


    const handleAdd = (tag) => setTags([...tags, tag]);
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));


    const handleModal = () => {
        setModal(!modal)
        setData(data)

    }


    const handeKeyPress = (e) => {
        if(e.keyCode === 13){ // this is the enter key
            searchPost();
        }
    }


    useEffect(() => {
        if (user) {
    axios.get('/posts')
        .then(res => {
          setData(res.data.data);
          console.log(res.data.data);
        })
  }else (navigation.navigate('/auth/not-auth'))
        }
        , [])

    const renderRecentPosts = () => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return sortedData.map((post, index) => {
            const formattedDate = new Intl.DateTimeFormat('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.createdAt));

            return (
                <div
                    key={index}
                    className={classnames('d-flex', {
                        'mb-2': index !== data.length - 1
                    })}
                >
                    <Link className='me-2' to={`/pages/programs/detail/${post._id}`}>
                        <img className='rounded' src={post.selectedFile}  alt={post.title} width='100' height='70' />
                    </Link>
                    <div>
                        <h6 className='blog-recent-post-title'>
                            <Link className='text-body-heading' to={`/pages/programs/detail/${post._id}`}>
                                {post.title}
                            </Link>
                        </h6>
                        <div className='text-muted mb-0'>{formattedDate}</div>
                    </div>
                </div>
            )
        })
    }

    const searchPost = () => {
        if(search.trim() || tags){
            // dispatch fetch search posts
            // push to search page
           getPostsBySearch({search,tags: tags.join(',')}); // this is a function that is imported from the actions folder
            history(`/pages/programs/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`); // push to url
        }else{
            history('/');
        }
    };
     const getPostsBySearch = (searchQuery) => async () => {
        try {
            const {data: {data} } = await axios.get(`/posts/programs?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
            console.log(data);
        } catch (error) {
            console.log(error);

        }
    }



  return (
    <div className='sidebar-detached sidebar-right'>
      <div className='sidebar'>
        <div className='blog-sidebar right-sidebar my-2 my-lg-0'>
          <div className='right-sidebar-content'>
            <div className='blog-search'>




                {/* <AppBar  position="static" color="inherit"  elevation={6}> */}

                                    <TextField name="search" variant="outlined" label="Search Program" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={handeKeyPress}/>
                                    <ChipInput style={{margin: '23px 0'}} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search By Tags" variant="outlined" />

                                    <Button disabled={!search && tags.length === 0} onClick={searchPost} className='ms-2' style={{color: 'rgba(150 141 238)' , fontFamily: 'Montserrat' }} variant='contained' color='primary'
                                    ><span style={{color: 'white', marginLeft: '14px' , marginRight: '12px' , fontSize: '12px' , fontWeight: 'lighter'
                                    }}>Search</span>  </Button>



            </div>


            {data !== null ? (
              <Fragment>
                <div className='blog-recent-posts mt-3'>
                  <h6 className='section-label'>Recent Posts</h6>
                  <div className='mt-75'>{renderRecentPosts()}</div>
                </div>
                  <div >
                      <Button onClick={handleModal}
                          className='ms-2' style={{color: 'rgba(150 141 238)' , fontFamily: 'Montserrat' , marginTop: '20px'
                      }} variant='contained' color='primary' ><span style={{color: 'white', marginLeft: '14px' , marginRight: '12px' , fontSize: '12px' , fontWeight: 'lighter'
                      }}>Get A Free Program </span>  </Button>

                  </div>
                  <FormProgram open={modal} handleModal={handleModal}  />
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogSidebar
