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
			default: "#f8f9fa" // Lavender Blush
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
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					// Applied to every Button component
					borderRadius: "8px",
					textTransform: "none",
					padding: "10px 20px"
				},
				containedPrimary: {
					// Specifically for primary variant
					"backgroundColor": "#FFAA4C", // Bright Yellow
					"&:hover": {
						backgroundColor: "#DD9933" // Darkened yellow
					}
				}
				// Add more styles for other variants if needed
			}
		},
		MuiTypography: {
			styleOverrides: {
				h1: {
					fontSize: "2rem",
					fontWeight: "bold",
					color: "#343434" // Jet
				},
				body1: {
					fontSize: "1rem",
					color: "#343434"
				}
				// Additional typography variants...
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
					borderRadius: "10px",
					padding: "20px"
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& label.Mui-focused": {
						color: "#00A6A6" // Persian Green
					},
					"& .MuiInput-underline:after": {
						borderBottomColor: "#00A6A6"
					},
					"& .MuiOutlinedInput-root": {
						"&:hover fieldset": {
							borderColor: "#57A0D3" // Carolina Blue
						},
						"&.Mui-focused fieldset": {
							borderColor: "#00A6A6"
						}
					}
				}
			}
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#00A6A6", // Persian Green
					color: "#FFF0F5" // Lavender Blush
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: `
                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                code {
                    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
                }
            `
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					// Set default width for all forms
					maxWidth: "sm",
					// "@media (min-width: 600px)": {
					// 	// sm breakpoint
					// 	width: "400px"
					// },
					margin: "auto" // Center the form
				}
			}
		}
	}
});

export default theme;
