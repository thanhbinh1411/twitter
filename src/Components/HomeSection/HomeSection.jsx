import React, { useEffect, useState } from "react";

import { Avatar, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageIcon from "@mui/icons-material/Image";

import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import TweetCard from "./TweetCard";
import { createTweet, getAllTweets } from "./../../Store/Twit/Action";
import { useDispatch, useSelector } from "react-redux";
import { uploadToCloudnary } from "../../Utils/uploadToCloudnary";

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Tweets text is required."),
});

const HomeSection = () => {
  const { auth } = useSelector((store) => store);
  const [uploadinImage, setUploadingImage] = useState(false);
  const [selectImage, setSelectedImage] = useState("");
  const dispatch = useDispatch();

  const twit = useSelector((store) => store.twit);
  console.log("Twit:    ", twit);

  useEffect(() => {
    dispatch(getAllTweets());
  }, [twit.like, twit.retwit, twit.twit]);

  const handleSubmit = (values, actions) => {
    dispatch(createTweet(values));
    actions.resetForm();
    console.log("values: ", values);
    setSelectedImage("");
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      image: "",
      isTweet: true,
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const handleSelectImage = async (event) => {
    setUploadingImage(true);
    const imgUrl = await uploadToCloudnary(event.target.files[0]);
    formik.setFieldValue("image", imgUrl);

    setSelectedImage(imgUrl);
    setUploadingImage(false);
  };
  return (
    <div className="space-y-5">
      <section>
        <h1 className="py- text-xl font-bold opacity-90">Home</h1>
      </section>
      <section className={`pb-10`}>
        <div className="flex space-x-5">
          <Avatar alt="username" src={auth.user?.image} />
          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <input
                  type="text"
                  name="content"
                  placeholder="What is happening?"
                  className={`border-none outline-none text-xl bg-transparent`}
                  {...formik.getFieldProps("content")}
                />
                {formik.errors.content && formik.touched.content && (
                  <span className="text-red-500">{formik.errors.content}</span>
                )}
              </div>
              <div>
                <img src="" alt="" />
              </div>
              <div className="flex justify-between items-center mt-5">
                <div className="flex space-x-5 items-center">
                  <label className="flex items-center space-x-2 rounded-md cursor-pointer">
                    <ImageIcon className="text-[#1d9bf0]"></ImageIcon>
                    <input
                      type="file"
                      name="imageFile"
                      className="hidden"
                      onChange={handleSelectImage}
                    />
                  </label>
                  <FmdGoodIcon className="text-[#1d9bf0]" />
                  <TagFacesIcon className="text-[#1d9bf0]" />
                </div>
                <div>
                  <Button
                    sx={{
                      width: "100%",
                      borderRadius: "20px",
                      paddingY: "8px",
                      paddingX: "20px",
                      bgcolor: "#1e88e5",
                    }}
                    variant="contained"
                    type="submit"
                  >
                    Tweet
                  </Button>
                </div>
              </div>
            </form>
            <div>{selectImage && <img src={selectImage} alt="" />}</div>
          </div>
        </div>
      </section>
      <section>
        {Array.isArray(twit.twits) && twit.twits.length > 0 ? (
          twit.twits.map((item) => <TweetCard key={item.id} item={item} />)
        ) : (
          <p>No tweets available</p>
        )}
      </section>
    </div>
  );
};

export default HomeSection;
