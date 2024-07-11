import { useRouteError } from "react-router-dom";

const Error = () =>{
  const error = useRouteError();
  console.error(error)

  return(
    <section>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred</p>
      <i>{error.statusText || error.message}</i>
    </section>
  )
}

export default Error;