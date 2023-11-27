import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#00A6A6" // Persian Green
		},
		secondary: {
			main: "#57A0D3" // Carolina Blue
		},
		tertiary: {
			main: "#FFAA4C" // Bright Yellow (Crayola)
		},
		text: {
			primary: "#343434" // Jet
		},
		background: {
			default: "#FFF0F5" // Lavender Blush
		}
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			textAlign: "center"
		},
		body1: {
			textAlign: "center"
		}
		// Add more typography styles as needed
	},
	components: {
		// Add global component styles if needed
	}
});
