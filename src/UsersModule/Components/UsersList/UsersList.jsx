import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import { toast } from "react-toastify";
import noData from "../../../assets/images/nodata.png";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";

export default function UsersList() {
  const baseUrl = "https://upskilling-egypt.com:443";
  const [usersList, setUsersList] = useState([]);
  const [userId, setUserId] = useState(0);
  const [modalState, setModalState] = useState("close");
  const [isLoading, setIsLoading] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(0);

  const handleClose = () => setModalState("close");

  const showDeleteModal = (id) => {
    // alert(id)
    setUserId(id);
    setModalState("delete-modal");
  };
  //*****************************GetAllUsers********************************* */
  const getAllUsers = (pageNo, userName, groups) => {
    axios
      .get(`${baseUrl}/api/v1/Users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          pageSize: 5,
          pageNumber: pageNo,
          userName: userName,
          groups: groups,
        },
      })
      .then((response) => {
        setUsersList(response?.data?.data);
        console.log(response?.data);
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
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });
  };
  // *********************searchByName*******************
  const getNameValue = (input) => {
    console.log(input.target.value);
    setSearchString(input.target.value);
    getAllUsers(1, input.target.value);
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
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
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <Header
        prefix={"Users"}
        title={"List"}
        paragraph={`You can now add your items that any user can order it from the Application and you can edit`}
      />
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
            <div className="col-md-6">
              <input
                onChange={getNameValue}
                placeholder="Search by User name..."
                className="form-control"
                type="text"
              />
            </div>
            <div className="col-md-6">
              <select onChange={getGroupValue} className="form-select">
                <option value={""}>Search by role 👋</option>
                <option value={1}>Admin</option>
                <option value={2}>System User</option>
              </select>
            </div>
          </div>
          {usersList.length > 0 ? (
            <div>
              <table className="table table-responsive table-striped ">
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
                              src={noData}
                              alt="user-img"
                            />
                          )}
                        </div>
                      </td>
                      <td>{User?.phoneNumber}</td>
                      <td>
                        <FaRegTrashCan
                          onClick={() => showDeleteModal(User.id)}
                          className="text-danger"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav aria-label="...">
                <ul className="pagination pagination-sm">
                  {pagesArray.map((pageNo, index) => (
                    <li
                      key={index}
                      onClick={() => getAllUsers(pageNo, searchString)}
                      className="page-item"
                    >
                      <a className="page-link">{pageNo}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </>
  );
}
