// ** Reactstrap Imports\
import { Card, CardHeader, CardTitle, CardBody, Table, Button } from "reactstrap"
import { useEffect, useState } from "react";
import axios from "axios"
import { Trash } from "react-feather"
import moment from "moment";

const RecentDevices = () => {
  const [recentDevicesArr, setRecentDevicesArr] = useState([])
  useEffect(() => {
    axios.get("/webauthn/devices").then((res) => {
      setRecentDevicesArr(res.data.devices)
    })
  }, [])

  const DeleteButton = ({ id }) => {
    const handleClick = () => {
      axios.delete(`/webauthn/devices/${id}`).then((res) => {
        console.log(res)
        setRecentDevicesArr(recentDevicesArr.filter((item) => item.id !== id))
      })
    }
    return (
      <Button color="danger" className="btn-icon rounded-circle" onClick={handleClick}>
        <Trash size={14} />
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">Recent devices</CardTitle>
      </CardHeader>
      <CardBody className="my-2 py-25">
        <Table className="text-nowrap text-center" responsive bordered>
          <thead>
          <tr>
            <th>Device</th>
            <th>OS</th>
            <th>Location</th>
            <th>Recent Activity</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {recentDevicesArr.length > 0 && recentDevicesArr.map((item, index) => {
            const { deviceInfo } = item
            return (
              <tr key={index}>
                <td className="text-start">
                    <span className="fw-bolder">{
                      deviceInfo.device ? `${deviceInfo.device.vendor} ${deviceInfo.device.model}` : `${deviceInfo.browser.name} ${deviceInfo.browser.version}`
                    }
                    </span>
                </td>
                <td>{deviceInfo.os.name} {deviceInfo.os.version}</td>
                <td>{item.location}</td>
                <td>{moment(item.createdAt).format("yyyy-MM-DD HH:mm")}</td>
                <td>
                  <DeleteButton />
                </td>
              </tr>
            )
          })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default RecentDevices
