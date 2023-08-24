import { createContext, useContext } from "react";

const DateContext = createContext();

export const useDate = () => {
	return useContext(DateContext);
};

export default DateContext;
