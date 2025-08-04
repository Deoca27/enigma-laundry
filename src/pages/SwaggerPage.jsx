
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const SwaggerPage = () => {
  return (
    <SwaggerUI url="http://localhost:8888/api/v1/swagger/index.html" />
  )
}

export default SwaggerPage
