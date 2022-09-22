import { ClientOnly } from "remix-utils";

const Hamburger = ({ onClick }) => {
  return (
    // <ClientOnly>
      {/* //   {() => ( */}
      <div className="nav-toggle" onClick={onClick}>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {/* // )} */}
    // </ClientOnly>
  );
};

export default Hamburger;
