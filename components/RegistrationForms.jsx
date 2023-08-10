import { Input } from "./Input.jsx";
import styles from "../styles";

import { FormProvider, useForm } from "react-hook-form";
import {
  name_validation,
  desc_validation,
  image_validation,
  num_validation,
  category_validation,
} from "../utils/inputValidations";
import { useState } from "react";
import { GrMail } from "react-icons/gr";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  update,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

export const Form = ({ wallet, setShowRegistrationForm }) => {
  const methods = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
    methods.reset();
    setSuccess(true);
    let camp_id = wallet + "-" + Date.now();

    // if the user is not registered in the database, add him
    const docRef = doc(db, "campaigns", wallet);
    getDoc(docRef).then((docSnap) => {
      if (!docSnap.exists()) {
        setDoc(doc(db, "campaigns", wallet), {
          userCampaigns: [],
        });
      }
    });

    setTimeout(() => {
      updateDoc(doc(db, "campaigns", wallet), {
        userCampaigns: arrayUnion({
          name: data.title,
          image: data.image,
          goal: data.goal,
          category: data.category,
          description: data.description,
          raised: 0,
          date: Date.now(),
          id: camp_id,
        }),
      });
    }, 3000);

    setShowRegistrationForm(false);
    toast.success("Form submitted successfully");
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="container z-50"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input {...name_validation} />
          <Input {...image_validation} />
          <Input {...num_validation} />
          <Input {...category_validation} />
          <Input {...desc_validation} className="md:col-span-2" />
        </div>
        <div className="mt-5">
          {success && (
            <p className="font-semibold text-green-500 mb-5 flex items-center py-1 px-2 gap-1 bg-white">
              <BsFillCheckSquareFill /> Form has been submitted successfully
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              className="p-5 rounded-md bg-blue-600 font-semibold  text-white flex items-center gap-1 hover:bg-blue-800 transition-all duration-300"
            >
              Submit Campaign
            </button>
            <button
              onClick={() => setShowRegistrationForm(false)}
              className="p-5 rounded-md bg-red-600 font-semibold text-white flex items-center gap-1 hover:bg-red-700 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;
