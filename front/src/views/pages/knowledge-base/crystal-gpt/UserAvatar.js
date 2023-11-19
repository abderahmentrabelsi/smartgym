import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import Avatar from "@components/avatar";
import { useEffect, useState } from "react";
import { isUserLoggedIn } from "@utils";

export const UserAvatar = () => {
  const [userData, setUserData] = useState(null)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  const userAvatar = (userData && userData.profilePicture) || defaultAvatar
  return (
    <Avatar img={userAvatar} imgHeight='32' imgWidth='32' status='online' />
  );
}
