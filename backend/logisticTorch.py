import torch
import torch.nn as nn
from progressbar import progressbar

class FrozenLogReg(torch.nn.Module):
    def __init__(self, input_dim, output_dim, freeze_which=None, start_values=None, start_bias=None):
        super(FrozenLogReg, self).__init__()
        self.linear = torch.nn.Linear(input_dim, output_dim) 
        self.input_dim = input_dim
        self.output_dim = output_dim
        self.freeze_which = freeze_which
        self.start_values = start_values
        with torch.no_grad():
            self.linear.weight[0] = torch.tensor(start_values)
            
            self.linear.bias[0] = torch.tensor(start_bias)
        self.linear.bias.requires_grad = False

    def forward(self, x):
        outputs = torch.sigmoid(self.linear(x))
        return outputs
    
    def setup(self, lr=0.05):
        self.criterion = torch.nn.BCELoss()
        self.lr = lr
        self.optimizer = torch.optim.Adam(self.parameters(), lr=self.lr)

    def train(self, epochs, x_train, y_train):
        for epoch in range(epochs):
            self.optimizer.zero_grad()
            outputs = self.forward(x_train)
            loss = self.criterion(outputs, y_train.unsqueeze(1))
            loss.backward()

            if self.freeze_which is not None:
                for name, param in self.named_parameters():
                    #print(name)
                    #print(param)
                    if name == 'linear.weight':
                        param.grad[0][self.freeze_which] = torch.zeros_like(param.grad[0][self.freeze_which])

            self.optimizer.step()
            #print('epoch {}, loss {}'.format(epoch, loss.item()))