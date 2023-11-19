import { Sticky, StickyContainer } from "react-sticky";

export function StickyWrapper(props) {
  return (
    <StickyContainer style={{ width: "30%", maxWidth: "30%" }}>
      <Sticky>
        {({ style: stickyStyle }) => {
          if (stickyStyle.position === "fixed") {
            stickyStyle.width = "28%";
          } else {
            delete stickyStyle.width;
          }
          return (
            <div id="sidebar" style={{ ...stickyStyle, zIndex: 10 }}>
              {props.children}
            </div>
          );
        }}
      </Sticky>
    </StickyContainer>
  );
}
