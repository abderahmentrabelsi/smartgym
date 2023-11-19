import React, { useState, useEffect } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {Link, useLocation} from "react-router-dom";
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'react-feather';


const Paginate = ({ page }) => {
    const location = useLocation();
    const currentPage = new URLSearchParams(location.search).get('page');
    const Pager = parseInt(page)



    const [numberOfPages, setNumberOfPages] = useState(0);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const { data } = await axios.get(`/posts?page=${page}`);
                setNumberOfPages(data.numberOfPages);
            } catch (error) {
                console.log(error);
            }
        };
        getPosts();
    }, [page]);

    const renderPaginationItems = () => {
        const items = [];

        // Add previous page button
        items.push(
            <PaginationItem key="prev" disabled={page <= 1}>
                <PaginationLink tag={Link} to={`/pages/programs/search?page=${Pager - 1}`} previous>
                    <ChevronLeft size={15} />
                </PaginationLink>
            </PaginationItem>
        );

        // Add page number buttons
        for (let i = 1; i <= numberOfPages; i++) {
            items.push(
                <PaginationItem key={i} active={currentPage == i} >
                    <PaginationLink tag={Link} to={`/pages/programs/search?page=${i}`}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Add next page button
        items.push(
            <PaginationItem key="next" disabled={page >= numberOfPages} >
                <PaginationLink tag={Link} to={`/pages/programs/search?page=${Pager + 1 }`} next>
                    <ChevronRight size={15} />
                </PaginationLink>
            </PaginationItem>
        );

        return items;
    };

    return (
        <Pagination className='d-flex mt-3'>
            {renderPaginationItems()}
        </Pagination>
    );
};

export default Paginate;
