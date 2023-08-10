/*-------------------------------------------------------------------
|  🐼 Input Validators 
|
|  🐯 Purpose: THIS FILE CONTAINS ALL THE VALIDATORS OBJECTS
|
|  🐸 Returns:  -
*-------------------------------------------------------------------*/

export const name_validation = {
  name: "title",
  label: "title",
  type: "text",
  multiType: false,
  id: "title",
  placeholder: "name of the campaign...",
  validation: {
    required: {
      value: true,
      message: "required",
    },
  },
};

export const desc_validation = {
  name: "description",
  label: "description",
  multiline: true,
  id: "description",
  placeholder: "write description ...",
  validation: {
    required: {
      value: true,
      message: "required",
    },
    maxLength: {
      value: 200,
      message: "200 characters max",
    },
  },
};

export const category_validation = {
  name: "category",
  label: "category",
  type: "text",
  multiType: false,
  id: "category",
  placeholder: "category of the campaign...",
  validation: {
    required: {
      value: true,
      message: "required",
    },
  },
};

export const num_validation = {
  name: "goal",
  label: "goal",
  type: "number",
  multiType: false,
  id: "goal",
  placeholder: "write your goal in SOL...",
  validation: {
    required: {
      value: true,
      message: "required",
    },
  },
};

//url image validation
export const image_validation = {
  name: "image",
  label: "image",
  type: "text",
  multiType: false,
  id: "image",
  placeholder: "image URL of the campaign...",
  validation: {
    required: {
      value: true,
      message: "required",
    },
  },
};
