import React, { useState, useEffect } from "react";
import { Add, Close, Delete, Done } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

interface StoredValue {
  value: string;
  done: boolean;
}

function InputLocalStorage() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [inputValue, setInputValue] = useState("");
  const [storedValues, setStoredValues] = useState<StoredValue[]>([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const storedInput = localStorage.getItem("userInputs");
    if (storedInput) {
      setStoredValues(JSON.parse(storedInput));
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setTouched(true);
  };

  const handleSubmit = () => {
    const newValues = [...storedValues, { value: inputValue, done: false }];
    localStorage.setItem("userInputs", JSON.stringify(newValues));
    setStoredValues(newValues);
    setInputValue("");
  };

  function handleKeyPress(event: { key: string }) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  const toggleDone = (index: number) => {
    const newValues = [...storedValues];
    newValues[index].done = !newValues[index].done;
    localStorage.setItem("userInputs", JSON.stringify(newValues));
    setStoredValues(newValues);
  };

  const removeItem = (indexToRemove: number) => {
    const newValues = storedValues.filter(
      (_, index) => index !== indexToRemove
    );
    localStorage.setItem("userInputs", JSON.stringify(newValues));
    setStoredValues(newValues);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        gap={2}
        sx={{ padding: "30px", width: isMobile ? "auto" : "500px" }}
      >
        <Typography variant="h6">To Do List</Typography>
        <Stack direction={"row"} gap={2}>
          <TextField
            id="outlined-basic"
            label="Add Your Task Here"
            variant="outlined"
            value={inputValue}
            onChange={handleChange}
            color="success"
            inputProps={{ maxLength: 15 }}
            style={{ width: "100%" }}
            onKeyDown={handleKeyPress}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={!touched || inputValue.trim() === ""}
          >
            <Add />
          </Button>
        </Stack>
        <Stack gap={2}>
          {storedValues.map((value, index) => (
            <Stack
              key={index}
              direction="row"
              gap={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body1"
                style={{
                  textDecoration: value.done ? "line-through" : "none",
                  color: value.done ? "red" : "inherit",
                  wordWrap: "break-word",
                }}
              >
                {value.value}
              </Typography>
              <Stack direction="row" gap={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => toggleDone(index)}
                >
                  {value.done ? <Close /> : <Done />}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(index)}
                >
                  <Delete />
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default InputLocalStorage;
