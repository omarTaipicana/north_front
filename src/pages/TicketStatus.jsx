import React from 'react'
import { useParams } from "react-router-dom";

const TicketStatus = () => {
      const { code } = useParams();
  return (
    <div>Ticket Status: {code}</div>
  )
}

export default TicketStatus