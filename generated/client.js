import artifactJson from "./artifact.json";

export default Object.keys(artifactJson).reduce((res, key) => {
  const resJson = import(
    "../generated/mock/" + artifactJson[key].response.replace("mock/", "")
  );
  const reqJson = import(
    "../generated/mock/" + artifactJson[key].response.replace("mock/", "")
  );
  res[key].response = resJson;
  res[key].request = reqJson;
  return res;
}, {});
