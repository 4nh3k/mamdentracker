"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "@/contexts/language-context"

interface InstructionsModalProps {
  open: boolean
  onClose: () => void
}

export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  const t = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("INSTRUCTIONS_TITLE")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-bold mb-2">{t("INTRO_TITLE")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("INTRO_TEXT")}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">{t("TURN_RULES_TITLE")}</h3>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                <li>{t("TURN_RULE_1")}</li>
                <li>{t("TURN_RULE_2")}</li>
                <li>{t("TURN_RULE_3")}</li>
                <li className="ml-6">{t("TURN_RULE_3_EXAMPLE")}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">{t("GAME_RULES_TITLE")}</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">{t("BALL_STRUCTURE_TITLE")}</h4>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside ml-4">
                    <li>{t("BALL_STRUCTURE_1")}</li>
                    <li>{t("BALL_STRUCTURE_2")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{t("SCORING_METHOD_TITLE")}</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-2 font-semibold">{t("BALL_3")}</th>
                          <th className="pb-2 font-semibold">{t("POINTS")}</th>
                          <th className="pb-2 font-semibold">{t("SCORE_NOTE")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="py-1">3</td>
                          <td className="py-1">1 {t("POINT")}</td>
                          <td className="py-1">-</td>
                        </tr>
                        <tr>
                          <td className="py-1">6</td>
                          <td className="py-1">2 {t("POINTS_PLURAL")}</td>
                          <td className="py-1">-</td>
                        </tr>
                        <tr>
                          <td className="py-1">9</td>
                          <td className="py-1">3 {t("POINTS_PLURAL")}</td>
                          <td className="py-1">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc list-inside">
                  <li>{t("RULE_1")}</li>
                  <li>{t("RULE_2")}</li>
                  <li>{t("RULE_3")}</li>
                  <li>{t("RULE_4")}</li>
                  <li>{t("RULE_5")}</li>
                  <li>{t("RULE_6")}</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">{t("SPECIAL_RULES_TITLE")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("SPECIAL_RULE_1")}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
