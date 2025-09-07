import { TextField } from "@mui/material";

const UniformSelect = ({ children, ...props }) => (
    <TextField
        select
        fullWidth
        {...props}
        sx={{
            "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                height: "50px !important", // keeps height same as textfield
            },
        }}
    >
        {children}
    </TextField>
);

export default UniformSelect;
