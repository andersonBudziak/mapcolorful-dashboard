
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductivityTable = () => {
  const data = [
    { year: 2023, productivity: 3600 },
    { year: 2022, productivity: 3600 },
    { year: 2021, productivity: 3600 },
    { year: 2020, productivity: 3720 },
    { year: 2019, productivity: 3900 },
    { year: 2018, productivity: 3600 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Produtividade histórica</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ano</TableHead>
            <TableHead>Produtividade (kg/ha)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.year}>
              <TableCell>{row.year}</TableCell>
              <TableCell>{row.productivity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ProductivityTable;
