import React from 'react'

const CountBox = ({ title, value }) => {
    return (
        <div className="d-flex flex-row align-items-center gap-1">
            <h4 className="fw-bold fs-3 text-truncate">{value}</h4>
            <p className="fw-normal fs-6 text-muted px-3 text-center">{title}</p>
        </div>
    )
}

export default CountBox
