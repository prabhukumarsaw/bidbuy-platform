import { Shield, Award, Package, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const specifications = {
  'Item Condition': 'Excellent - Museum Quality',
  Age: 'Late Victorian (circa 1890)',
  Material: 'Gold-plated brass with intricate engravings',
  Dimensions: 'H: 12 inches, W: 5 inches, D: 5 inches',
  Weight: '2.5 lbs (1.13 kg)',
  Origin: 'Ottoman Empire, Late 19th Century',
  Provenance: 'Private collection, London',
  Authentication: 'Certificate of Authenticity included',
  Conservation: 'Professionally restored in 2020',
  'Insurance Value': '$15,000 USD',
};

const features = [
  {
    icon: Shield,
    text: 'Buyer Protection',
    description: 'Full insurance coverage during transit',
  },
  {
    icon: Award,
    text: 'Authenticated',
    description: 'Verified by expert appraisers',
  },
  {
    icon: Package,
    text: 'White Glove Delivery',
    description: 'Professional art handling',
  },
];

export function ProductDetails() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">Lot #137684</Badge>
          <Badge variant="outline" className="text-violet-600">
            Featured
          </Badge>
          <Badge variant="outline" className="text-emerald-600">
            Museum Quality
          </Badge>
        </div>
        <h1 className="text-xl sm:text-lg md:text-xl lg:text-2xl  font-semibold tracking-tight ">
          Exceptional Victorian Aladdin's Lamp: A Masterpiece of 19th Century
          Craftsmanship
        </h1>
        <p className="mt-4 text-sm sm:text-sm md:text-md lg:text-base text-muted-foreground leading-relaxed">
          An extraordinary example of late Victorian decorative arts, this
          exquisite Aladdin's lamp represents the pinnacle of 19th-century
          metalwork. Its intricate engravings and superior craftsmanship
          exemplify the artistic excellence of the Ottoman Empire's master
          artisans.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-3 gap-4 py-4">
        {features.map(({ icon: Icon, text, description }) => (
          <div
            key={text}
            className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50"
          >
            <Icon className="h-6 w-6 text-violet-600 mb-2" />
            <span className="font-semibold">{text}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Detailed Information */}
      <Accordion
        type="multiple"
        defaultValue={['details', 'condition', 'history']}
        className="w-full "
      >
        <AccordionItem value="details">
          <AccordionTrigger className="text-base font-bold tracking-tight">
            Product Specifications
          </AccordionTrigger>
          <AccordionContent>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {key}
                  </dt>
                  <dd className="text-sm mt-1">{value}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger className="text-base font-bold tracking-tight">
            Condition Report
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <p>
                This lamp is in exceptional condition, maintaining its original
                gilding with minimal wear consistent with age. The intricate
                engravings remain crisp and well-defined throughout.
              </p>
              <p>
                The mechanical components are fully functional, and the original
                patina adds character while preserving the piece's historical
                integrity.
              </p>
              <Button variant="outline" className="w-full mt-4 gap-2">
                <FileDown className="h-4 w-4" />
                Download Detailed Condition Report
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="history">
          <AccordionTrigger className="text-base font-bold tracking-tight ">
            Historical Significance
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <p>
                This lamp exemplifies the cultural exchange between Victorian
                Britain and the Ottoman Empire during the late 19th century. Its
                design combines traditional Middle Eastern motifs with Victorian
                aesthetic sensibilities.
              </p>
              <p>
                Previously exhibited at the British Museum's "Victorian
                Orientalism" exhibition (1985) and featured in multiple
                scholarly publications.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
