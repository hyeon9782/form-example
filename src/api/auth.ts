type User = {
  email: string;
  password: string;
};
const signUp = async (formData: User) => {
  return await fetch("api/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  }).then((res) => res.json());
};

export { signUp };
