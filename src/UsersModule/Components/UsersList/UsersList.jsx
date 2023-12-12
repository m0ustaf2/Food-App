import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import { toast } from "react-toastify";
import noData from "../../../assets/images/nodata.png";
import userAvatar from "../../../assets/images/userr.png"
import NoData from "../../../SharedModule/Components/NoData/NoData";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Loading from "../../../SharedModule/Components/Loading/Loading";
import { Helmet } from "react-helmet";

export default function UsersList() {
  let { headers, baseUrl } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [userId, setUserId] = useState(0);
  const [modalState, setModalState] = useState("close");
  const [isLoading, setIsLoading] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentPg, setCurrentPg] = useState(1);


  const handleClose = () => setModalState("close");

  const showDeleteModal = (id) => {
    setUserId(id);
    setModalState("delete-modal");
  };
  //*****************************GetAllUsers********************************* */
  const getAllUsers = (currentPg, userName, groups) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/v1/Users/`, {
        headers,
        params: {
          pageSize: 5,
          pageNumber: currentPg,
          userName: userName,
          groups: groups,
        },
      })
      .then((response) => {
        setUsersList(response?.data?.data);
        console.log(response?.data);
        setIsLoading(false);
        console.log(
          Array(response.data.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setPagesArray(
          Array(response.data.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setIsLoading(false);
      });
  };

  // --------change-page--------
 const changePage = (pgindex, searchString,selectedGroup) => {
  console.log(pgindex);
  setCurrentPg(pgindex);
  getAllUsers(pgindex, searchString,selectedGroup);
};
// --------handle-next-btn--------
const nextPages = () => {
  setCurrentPg(parseInt(currentPg) + 1);
  getAllUsers(parseInt(currentPg) + 1);
};
// --------handle-previous-btn--------
const previousPages = () => {
  setCurrentPg(parseInt(currentPg) - 1);
  getAllUsers(parseInt(currentPg) - 1);
};
  // *********************searchByName*******************
  const getNameValue = (input) => {
    console.log(input.target.value);
    setSearchString(input.target.value);
    getAllUsers(1, input.target.value, selectedGroup);
  };
  // ********************SearchByGroup********************
  const getGroupValue = (select) => {
    setSelectedGroup(select.target.value);
    getAllUsers(1, searchString, select.target.value);
  };
  // ---------------------deleteUser--------------------
  const deleteUser = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/api/v1/Users/${userId}`, {
        headers,
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("User deleted successfully");
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Axios Error");
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Users List</title>
      </Helmet>
      <div className="responsiv">
        <Header
          prefix={"Users"}
          title={"List"}
          paragraph={`You can now add your items that any user can order it from the Application and you can edit`}
        />
      </div>

      {/* ************************Delete Modal******************************* */}
      <Modal show={modalState == "delete-modal"} onHide={handleClose}>
        <Modal.Body>
          <div className="text-center">
            <img className="w-50" src={noData} alt="avatar" />
            <h4 className="my-3">Delete This User ?</h4>
            <span className="text-muted">
              are you sure you want to delete this user ? if you are sure just
              click on delete this user
            </span>
            <hr />
            <div className="form-group my-3 text-end">
              <button
                onClick={deleteUser}
                className={
                  "btn btn-outline-danger" + (isLoading ? " disabled" : "")
                }
              >
                {isLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Delete this user"
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="row mx-2 p-3">
        <div className="col-md-12 mb-5">
          <div>
            <h6 className="fw-bold">Users Table Detailes</h6>
            <span>You can check all details</span>
          </div>
        </div>
        <div>
          <div className="row my-2">
            <div className="col-md-6 my-1 responsiv">
              <input
                onChange={getNameValue}
                placeholder="Search by User name..."
                className="form-control border-success"
                type="text"
              />
            </div>
            <div className="col-md-6 my-1 responsiv">
              <select onChange={getGroupValue} className="form-select border-success">
                <option value={""}>Search by role</option>
                <option value={1}>Admin</option>
                <option value={2}>System User</option>
              </select>
            </div>
          </div>
          {!isLoading ? (
            <>
              {usersList.length > 0 ? (
                <div>
                  <div className="table-responsive tble-res">
                    <table className="table table-responsive table-striped  table-success ">
                      <thead>
                        <tr>
                          <th className="table-secondary p-3" scope="col">
                            #
                          </th>
                          <th className="table-secondary p-3" scope="col">
                            User Name
                          </th>
                          <th className="table-secondary p-3" scope="col">
                            Image
                          </th>
                          <th className="table-secondary p-3" scope="col">
                            Phone Number
                          </th>
                          <th className="table-secondary p-3" scope="col">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((User, index) => (
                          <tr key={User?.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{User?.userName}</td>
                            <td>
                              <div className="img-container">
                                {User?.imagePath ? (
                                  <img
                                    className="img-fluid rounded-2"
                                    src={`${baseUrl}/` + User?.imagePath}
                                    alt="user-img"
                                  />
                                ) : (
                                  <img
                                    className="img-fluid"
                                    src={userAvatar}
                                    alt="user-img"
                                  />
                                )}
                              </div>
                            </td>
                            <td>{User?.phoneNumber}</td>
                            <td className="text-center">
                              <FaRegTrashCan
                                onClick={() => showDeleteModal(User.id)}
                                className="text-danger del"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <nav
                      className="d-flex justify-content-center "
                      aria-label="..."
                    >
                      <ul className="pagination pagination-sm responsiv">
                      <li className={currentPg <= 1 ? "disabled  page-item":"page-item" }>
                        <a className="page-link pag" onClick={()=>previousPages()}>Previous</a>
                      </li>
                      {pagesArray.map((pageNo, index) => (
                        <li
                          key={index}
                          onClick={() => changePage(pageNo, searchString,selectedGroup)}
                          className={pageNo ==currentPg ? "active page-item":"page-item" }
                        >
                          <a className="page-link pag">{pageNo}</a>
                        </li>
                      ))}
                      <li className={currentPg >= pagesArray.length ? "disabled page-item":"page-item" }>
                        <a className="page-link pag" onClick={()=>nextPages()}>
                          Next
                        </a>
                      </li>
                    </ul>
                    </nav>
                  </div>
                </div>
              ) : (
                <NoData />
              )}
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
}
