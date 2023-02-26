import { app } from './app';

const PORT: string | number = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
