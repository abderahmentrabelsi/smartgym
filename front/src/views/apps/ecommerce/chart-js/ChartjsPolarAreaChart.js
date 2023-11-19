// ** Third Party Components
import { PolarArea } from 'react-chartjs-2'
import { MoreVertical } from 'react-feather'





// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import {useEffect, useState} from "react";
import axios from "axios";


const ChartjsPolarAreaChart = props => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/products');
      const products = response.data.results.map(({ name, qty }) => ({ name, qty }));
      setProduct(products);
      console.log(products);
    };

    fetchProducts();
  }, []);


  // ** Props
  const { primary, greyColor, labelColor, yellowColor, infoColorShade, warningColorShade, successColorShade } = props

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: labelColor,
          usePointStyle: true
        }
      }
    }
  }

  // ** Chart Data
  const data = {
    labels: product.map((p) => p.name),
    datasets: [
      {
        borderWidth: 0,
        label: 'Qty',
        data: product.map((p) => p.qty),
        backgroundColor: [primary, yellowColor, warningColorShade, infoColorShade, greyColor, successColorShade]
      }
    ]
  }

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Product & Qty</CardTitle>
        <UncontrolledDropdown>
          <DropdownToggle className='cursor-pointer' tag='span'>
            <MoreVertical size={14} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className='w-100'>Last 28 days</DropdownItem>
            <DropdownItem className='w-100'>Last Month</DropdownItem>
            <DropdownItem className='w-100'>Last Year</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <div style={{ height: '350px' ,width: '100%'}}>
          <PolarArea data={data} options={options} height={350} width={1400} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsPolarAreaChart
