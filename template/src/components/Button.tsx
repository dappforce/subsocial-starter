import { useState } from 'react'
import "../App.css";

type ButtonPropsType = {
  onClick: () => Promise<void>,
  title: string,
  inactiveTitle: string
}

const Button = ({ onClick, title, inactiveTitle }: ButtonPropsType) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return;

    setLoading(true)
    try {
      await onClick()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return <div onClick={handleClick} className="button">
    {loading ? inactiveTitle : title}
  </div>
}

export default Button;
