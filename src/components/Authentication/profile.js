import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';

const ProfilePage = () => {
  const history = useHistory();
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [spinner, setSpinner] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    axios.get(ImportedURL.API.getUser)
      .then((res) => {
        setData(res.data);
        setSpinner(false);
      }).catch((response) => {
        console.log(response);
        setSpinner(false);
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
    if (name === 'avatar' && file) {
      setPreview(URL.createObjectURL(file)); // Update the preview URL
    }
    if (submitted) {
      validateField(name, files ? files[0] : value);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!data.firstname.trim()) {
      newErrors.firstname = 'First name is required';
      valid = false;
    }
    if (!data.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
      valid = false;
    }
    if (!data.avatar) {
      newErrors.avatar = 'Avatar is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const formData = new FormData();
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    if (validate()) {
      // Submit the form data
      axios.post(ImportedURL.API.updateUser + "/" + data._id, formData)
        .then((res) => {
          Success("Updated successfully");
          history.push('./tasks')
        }).catch(({ response }) => {
          Error(response.statusText);
        });
    }
  };
  return (
    <Container className="profile-container mb-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="profile-card">
            <Card.Body>
              <h2 className="text-center">Profile</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="mt-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    placeholder="First name"
                    value={data.firstname}
                    onChange={handleChange}
                    isInvalid={submitted && !!errors.firstname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    placeholder="Last name"
                    value={data.lastname}
                    onChange={handleChange}
                    isInvalid={submitted && !!errors.lastname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAvatar" className="mt-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    isInvalid={submitted && !!errors.avatar}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.avatar}
                  </Form.Control.Feedback>
                </Form.Group>

                {(preview || data.avatar) ?
                  <div className="mt-3 text-center">
                    <Image src={preview ? preview : ImportedURL.FILEURL + data.avatar} roundedCircle width={150} height={150} alt="Avatar Preview" />
                  </div> : ""
                }

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => history.goBack()}>
                    Back
                  </Button>
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div id="overlay" style={{ display: spinner ? 'block' : 'none' }}></div>
      {spinner ? <div className="spinner-border text-primary" role="status">
        <span className="sr-only"></span>
      </div> : ""}
    </Container>
  );
};

export default ProfilePage;
