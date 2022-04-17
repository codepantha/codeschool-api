export const register = (req, res) => {
  console.log(req.body);
  res.json('you hit the register endpoint from the controller.');
};
