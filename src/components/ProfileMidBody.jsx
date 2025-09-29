import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";

import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function ProfileMidBody() {

  const url = "https://firebasestorage.googleapis.com/v0/b/twitter-app-ba819.firebasestorage.app/o/profile-picture%2F2bb789108830735.5fc678bebea13.png?alt=media&token=254d250d-69ec-40bb-9107-6e7f77462280";
  const pic = "https://firebasestorage.googleapis.com/v0/b/twitter-app-ba819.firebasestorage.app/o/profile-picture%2Fimages.steamusercontent.jpg?alt=media&token=543ca5d1-4c8d-4aaa-9bf5-8c75938b0a1d";

  const dispatch = useDispatch();
  const posts = useSelector(store => store.posts.posts);
  const loading = useSelector(store => store.posts.loading);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    dispatch(fetchPostsByUser(currentUser.uid));
  }, [dispatch, currentUser]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft: 15,
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
          </Button>
        </Col>
      </Row>

      <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
        Daniel
      </p>

      <p style={{ marginBottom: "2px" }}>@daniel.hehe</p>

      <p>Software Developer</p>

      <p>Entrepreneur</p>

      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>

      {loading && (
        <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
      )}

      {posts.length > 0 && posts.map((post) => (
        <ProfilePostCard key={post.id} post={post} />
      ))}

    </Col>
  )
}