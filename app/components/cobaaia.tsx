import { Button } from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Header  from "./layout/Header";
import { Sidebar }  from "./layout/Sidebar";


export default function ComponentsPage() {
    return (
        <main className="min-h-screen bg-black p-10 flex gap-6">
            {/*ui*/}
            <Button /> 
            <Card /> 
            <Badge />

            {/*Layout*/}

            <Header />
            <Sidebar />
        </main>
    );
}