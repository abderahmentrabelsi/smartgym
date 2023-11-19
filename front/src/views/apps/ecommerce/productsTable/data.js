import Avatar from '@components/avatar'
import {MoreVertical, Edit, Trash, FileText, Archive} from 'react-feather'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import MySwal from "sweetalert2";


export let data



export const columns = [
  {
    name: 'Name',
    // minWidth: '400px',
    sortable: row => row.name,
    cell: row => (
        <div className='d-flex align-items-center'>
          <Avatar img={row.image} />
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{row.name}</span>
            <small>{row.brand}</small>
          </div>
        </div>
    )
  },
  {
    name: 'Price',
    sortable: true,
    // minWidth: '330px',
    selector: row => row.price
  },
  {
    name: 'Qty',
    sortable: true,
    // minWidth: '300px',
    selector: row => row.qty
  },
  {
    name: 'Rating',
    sortable: true,
    // minWidth: '270px',
    selector: row => row.rating
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: row => {
      const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = row.id;
        MySwal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1',
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete(`/products/${productId}`);
              setData((prevData) => prevData.filter((product) => product.id !== productId)); // remove deleted product from state array
              MySwal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your product has been deleted.',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              });
              navigate('/apps/ecommerce/shop'); // redirect to /apps/ecommerce/shop on successful delete
            } catch (error) {
              console.log(error);
              navigate('/apps/ecommerce/shop'); // redirect to /apps/ecommerce/shop on error
            }
          }
        });
      };




// in the component body
      const navigate = useNavigate();
      const [data, setData] = useState([]);

      return (
          <div className='d-flex'>
            <UncontrolledDropdown>
              <DropdownToggle className='pe-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                  <FileText size={15} />
                  <span className='align-middle ms-50'>Details</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                  <Archive size={15} />
                  <span className='align-middle ms-50'>Archive</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/' className='w-100' onClick={handleDelete}>
                  <Trash size={15} />
                  <span className='align-middle ms-50'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Edit size={15} />
          </div>
      )
    }
  }
];
export const useProductData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/products');
      setData(response.data.results);
    };

    fetchData();
  }, []);

  return data;
};


